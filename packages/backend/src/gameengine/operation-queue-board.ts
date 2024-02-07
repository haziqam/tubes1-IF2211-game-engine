import { Position } from "@etimo/diamonds2-types";
import * as async from "async";
import { IBoardConfig, IBot } from "../types";
import { Board } from "./board";
import { AbstractGameObjectProvider } from "./gameobjects/abstract-game-object-providers";
/**
 * A class that wraps a board with an operation queue. This class will abstract the handling of operations
 * on the board to prevent multiple simultaneous operations at the same time.
 *
 * At the moment the following operations are handled in a queue:
 * * move
 * * join
 */
export class OperationQueueBoard extends Board {
  private opQueue!: ReturnType<typeof async.queue>;

  constructor(
    id: number,
    config: IBoardConfig,
    gameObjectProviders: AbstractGameObjectProvider[],
    protected logger: any,
  ) {
    super(id, config, gameObjectProviders, logger);
    this.setupOperationQueue();
  }

  /**
   * The board uses an operation queue to handle multiple requests to operate on the board.
   * All operations on the board are queued and handled one after another.
   * Currently all move commands are handled using this queue.
   */
  private setupOperationQueue() {
    // Move queue
    const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
    this.opQueue = async.queue(
      async (
        t: OperationQueueEvent,
        cb: (v: boolean | null, e: Error | null) => void,
      ) => {
        try {
          const res = await t.run();
          cb(res, null);
        } catch (e: any) {
          cb(null, e as Error);
        }
      },
    );
  }

  /**
   * Queue a join to a board. Will prevent multiple simultaneous calls to collide.
   * @param bot
   */
  public async enqueueJoin(bot: IBot): Promise<boolean> {
    // Queue join
    const event = new OperationQueueJoinEvent(bot, this);
    return new Promise((resolve, reject) => {
      this.opQueue.push(event, (err) => {
        console.log("=================================");
        console.log(
          "backend/src/gameengine/operation-queue-boards.ts at line 61",
        );
        console.log(
          `err: ${err}, err instanceof TypeError: ${err instanceof TypeError}`,
        );
        console.log("=================================");
        if (err) {
          if (err instanceof TypeError) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Queue a move on a board. Will prevent multiple simultaneous calls to collide.
   * @param bot
   */
  public async enqueueMove(bot: IBot, delta: Position): Promise<boolean> {
    const event = new OperationQueueMoveEvent(bot, this, delta);
    return new Promise((resolve, reject) => {
      this.opQueue.push(event, (err) => {
        console.log("=================================");
        console.log(
          "backend/src/gameengine/operation-queue-boards.ts at line 77",
        );
        console.log(
          `err: ${err}, err instanceof TypeError: ${err instanceof TypeError}`,
        );
        console.log("=================================");
        if (err) {
          if (err instanceof TypeError) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(true);
        }
      });
    });
  }
}

export class OperationQueueEvent {
  queuedAt = new Date();

  constructor(protected bot: IBot, protected board: Board) {}

  run(): Promise<boolean> {
    throw Error("Not implemented");
  }
}

export class OperationQueueMoveEvent extends OperationQueueEvent {
  constructor(
    protected bot: IBot,
    protected board: Board,
    protected delta: Position,
  ) {
    super(bot, board);
  }

  run() {
    console.log("=================================");
    console.log("backend/src/gameengine/operation-queue-boards.ts at line 113");
    console.log(
      `this.bot.name: ${this.bot.name}, this.delta: ${this.delta.x}, ${this.delta.y}`,
    );
    console.log("=================================");
    return this.board.move(this.bot, this.delta);
  }
}

export class OperationQueueJoinEvent extends OperationQueueEvent {
  run() {
    return this.board.join(this.bot);
  }
}
