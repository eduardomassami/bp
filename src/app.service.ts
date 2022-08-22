import { Injectable } from '@nestjs/common';
import { Players } from './players.model';
import { Property } from './property.model';
import { ResponseDTO } from './response.dto';
import { Helpers } from './app.helpers';

@Injectable()
export class AppService {
  getSimulation(): ResponseDTO {
    const properties: Property[] = [];
    (() => {
      for (let index = 0; index < 20; index++) {
        properties.push({
          order: index,
          owner: '',
          saleValue: Helpers.randomValue(3, false, 100),
          rentValue: Helpers.randomValue(6, false, 10),
        });
      }
    })();

    const players: Players = {
      impulsive: {
        position: 0,
        profile: 'impulsive',
        netBalance: 300,
        isOut: false,
      },
      demanding: {
        position: 0,
        profile: 'demanding',
        netBalance: 300,
        isOut: false,
      },
      cautious: {
        position: 0,
        profile: 'cautious',
        netBalance: 300,
        isOut: false,
      },
      random: {
        position: 0,
        profile: 'random',
        netBalance: 300,
        isOut: false,
      },
    };

    let rounds = 1;
    let haveWinner = false;

    while (rounds <= 1000 && !haveWinner) {
      for (const key in players) {
        if (Helpers.checkIfHaveWinner(players)) {
          haveWinner = true;
          break;
        }

        const player = players[key];

        if (!player.isOut) {
          const diceThrow = Helpers.randomValue(6, true, 0);

          player.position += diceThrow - 1;

          if (player.position > 19) {
            player.position = player.position - 19;
            players[key].netBalance += 100;
          }

          Helpers.checkIfBuy(player, properties, players);
          Helpers.checkIfRent(
            player,
            properties[player.position],
            properties,
            players,
          );

          rounds++;
        }
      }
    }

    // console.log(rounds);
    // console.log(players);

    return Helpers.setResponse(players);
  }
}
