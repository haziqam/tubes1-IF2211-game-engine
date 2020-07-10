import { MigrationInterface, QueryRunner } from "typeorm";

export class etimoTeam1594374031418 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const teamEtimo = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("teams")
      .values({
        abbreviation: "etimo",
        name: "Etimo",
        logotypeUrl:
          "https://etimo-diamonds.s3.eu-north-1.amazonaws.com/images/etimoLogo.png",
      })
      .execute();

    const teamLiu = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("teams")
      .values({
        abbreviation: "liu",
        name: "Linköpings Universitet",
        logotypeUrl:
          "https://etimo-diamonds.s3.eu-north-1.amazonaws.com/images/liuLogo.png",
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .update("bot_registrations")
      .where("botName = :nameOne OR botName = :nameTwo", {
        nameOne: "etimo1",
        nameTwo: "etimo2",
      })
      .set({
        team: teamEtimo["raw"][0]["id"],
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .update("bot_registrations")
      .where("team IS NULL")
      .set({
        team: teamLiu["raw"][0]["id"],
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from("high_scores")
      .where("abbreviation = :abbreviation", {
        abbreviation: "etimo",
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from("high_scores")
      .where("abbreviation = :abbreviation", {
        abbreviation: "liu",
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .update("bot_registrations")
      .set({
        team: null,
      })
      .execute();
  }
}
