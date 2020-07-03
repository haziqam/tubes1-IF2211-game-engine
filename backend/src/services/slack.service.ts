import { Injectable } from "@nestjs/common";
import { SeasonsService } from "./seasons.service";
import {
  createSeasonsBody,
  createAddSeasonBody,
  showModal,
} from "../utils/slack.utils";

@Injectable()
export class SlackService {
  constructor(private seasonsService: SeasonsService) {}

  public async getAllSeasons(input) {
    const seasons = await this.seasonsService.all();
    const view = createSeasonsBody(input.trigger_id, seasons);
    return await showModal(view);
  }

  public async getSeasonModal(input) {
    console.log("GET SEASON MODAL");
    console.log(input);
    const view = createAddSeasonBody(input.trigger_id);
    return await showModal(view);
  }

  public async handleInteract(input) {
    switch (input.callback_id) {
      case "add_season":
        return this.addSeason(input);
      default:
        return;
    }
  }

  private async addSeason(input) {
    console.log("ADDING SEASON");
    console.log(input);
  }
}