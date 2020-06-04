import { ApiModelProperty } from "@nestjs/swagger";
import { HighScoreEntity } from "../db/models/highScores.entity";

export class HighscoreDto {
  @ApiModelProperty()
  botName: string;
  @ApiModelProperty()
  score: number;
  @ApiModelProperty()
  season: string;

  public static from(dto: Partial<HighscoreDto>) {
    const highScoreObj = new HighscoreDto();
    highScoreObj.botName = dto.botName;
    highScoreObj.score = dto.score;
    highScoreObj.season = dto.season;
    return highScoreObj;
  }

  public static fromEntity(entity: HighScoreEntity) {
    return this.from({
      botName: entity.botName,
      score: entity.score,
      season: entity.seasonId,
    });
  }
}
