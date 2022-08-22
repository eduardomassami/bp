import { Player, Players } from 'src/players.model';
import { ResponseDTO } from 'src/response.dto';
import { Property } from './property.model';

export class Helpers {
  static setResponse(players: Players): ResponseDTO {
    // setting the response
    const byValue = [];
    for (const key in players) {
      byValue.push(players[key]);
    }
    byValue.sort((a, b) => {
      return b.netBalance - a.netBalance;
    });
    const finalScore = byValue.map((player) => {
      return player.profile;
    });
    return {
      vencedor: finalScore[0],
      jogadores: finalScore,
    };
  }

  static checkIfHaveWinner(players: Players): boolean {
    const filtered = Object.keys(players).filter((player) => {
      if (!players[player].isOut) {
        return player;
      }
    });

    return filtered.length === 1;
  }

  static randomValue(
    max: number,
    isIntNumber: boolean,
    multiplier: number,
  ): number {
    const randValue = 1 + max * Math.random();
    if (isIntNumber) {
      return Math.floor(randValue);
    }
    return Math.round(randValue * multiplier);
  }

  static checkIfBuy(player: Player, properties: Property[], players: Players) {
    const { position, profile, netBalance } = player;
    const { owner, saleValue, rentValue } = properties[position];

    if (!owner && netBalance >= saleValue) {
      const newBalance = netBalance - saleValue;

      switch (profile) {
        case 'impulsive':
          properties[position].owner = profile;
          players[profile].netBalance = newBalance;
          break;

        case 'demanding':
          if (rentValue > 50) {
            properties[position].owner = profile;
            players[profile].netBalance = newBalance;
          }
          break;

        case 'cautious':
          if (netBalance - saleValue > 80) {
            properties[position].owner = profile;
            players[profile].netBalance = newBalance;
          }
          break;

        case 'random':
          if (Math.random() < 0.5) {
            properties[position].owner = profile;
            players[profile].netBalance = newBalance;
          }
          break;
      }
      return;
    }
  }

  static checkIfRent(
    player: Player,
    property: Property,
    properties: Property[],
    players: Players,
  ) {
    const { profile, netBalance } = player;
    const { owner, rentValue } = property;

    if (owner && owner != profile) {
      const newBalance = netBalance - rentValue;

      if (newBalance <= 0) {
        // remove player and set his properties as available
        players[profile].isOut = true;
        properties.forEach((p) => {
          if (p.owner === profile) {
            p.owner = '';
          }
        });
      }

      players[profile].netBalance = newBalance;
      players[owner].netBalance += rentValue;

      return;
    }
  }
}
