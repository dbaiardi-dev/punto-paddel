// Lógica de puntos de Pádel - PuntoPaddel
// Basado en reglas oficiales de pádel

export type Team = 'blue' | 'red';
export type PointValue = 0 | 15 | 30 | 40;
export type DeuceState = 'NONE' | 'BP1' | 'ADV' | 'BP2' | 'GOLDEN';

export interface GameState {
  bluePoints: PointValue;
  redPoints: PointValue;
  deuceState: DeuceState;
  advantageTeam: Team | null;
  isBreakPoint: boolean;
  breakPointNumber: number;
  gameWonBy: Team | null;
  servingTeam: Team;
}

export interface SetState {
  blueGames: number;
  redGames: number;
  currentGame: GameState;
  setWonBy: Team | null;
  tieBreak: boolean;
}

export interface MatchState {
  sets: SetState[];
  currentSetIndex: number;
  matchWonBy: Team | null;
  stats: {
    blueGamesWon: number;
    redGamesWon: number;
    blueSetsWon: number;
    redSetsWon: number;
  };
}

// Incrementar punto normal: 0 -> 15 -> 30 -> 40
export function incrementPoint(current: PointValue): PointValue {
  switch (current) {
    case 0: return 15;
    case 15: return 30;
    case 30: return 40;
    case 40: return 40; // Se mantiene si ya está en 40
    default: return 0;
  }
}

// Crear un nuevo game
export function createGame(servingTeam: Team): GameState {
  return {
    bluePoints: 0,
    redPoints: 0,
    deuceState: 'NONE',
    advantageTeam: null,
    isBreakPoint: false,
    breakPointNumber: 0,
    gameWonBy: null,
    servingTeam,
  };
}

// Resetear game con alternancia de saque
export function resetGame(previousServingTeam: Team): GameState {
  const newServingTeam: Team = previousServingTeam === 'blue' ? 'red' : 'blue';
  return createGame(newServingTeam);
}

// Crear un nuevo set
export function createSet(servingTeam: Team): SetState {
  return {
    blueGames: 0,
    redGames: 0,
    currentGame: createGame(servingTeam),
    setWonBy: null,
    tieBreak: false,
  };
}

// Crear un nuevo partido
export function createMatch(firstServingTeam: Team = 'blue'): MatchState {
  return {
    sets: [createSet(firstServingTeam)],
    currentSetIndex: 0,
    matchWonBy: null,
    stats: {
      blueGamesWon: 0,
      redGamesWon: 0,
      blueSetsWon: 0,
      redSetsWon: 0,
    },
  };
}

// Procesar un punto
export function processPoint(state: GameState, scoringTeam: Team): GameState {
  const newState = { ...state };
  const opponentTeam: Team = scoringTeam === 'blue' ? 'red' : 'blue';
  
  const scoringPoints = scoringTeam === 'blue' ? newState.bluePoints : newState.redPoints;
  const opponentPoints = opponentTeam === 'blue' ? newState.bluePoints : newState.redPoints;

  // Caso especial: ambos en 40 (deuce)
  if (scoringPoints === 40 && opponentPoints === 40) {
    return handleDeucePoint(newState, scoringTeam, opponentTeam);
  }

  // Si ya estamos en estado de deuce
  if (newState.deuceState !== 'NONE') {
    return handleDeucePoint(newState, scoringTeam, opponentTeam);
  }

  // Incremento normal
  if (scoringTeam === 'blue') {
    newState.bluePoints = incrementPoint(newState.bluePoints);
  } else {
    newState.redPoints = incrementPoint(newState.redPoints);
  }

  // Verificar si entramos en deuce después del incremento
  if (newState.bluePoints === 40 && newState.redPoints === 40) {
    newState.deuceState = 'BP1';
    newState.isBreakPoint = true;
    newState.breakPointNumber = 1;
  }

  // Verificar si el scoring team ganó el game
  const newScoringPoints = scoringTeam === 'blue' ? newState.bluePoints : newState.redPoints;
  const newOpponentPoints = opponentTeam === 'blue' ? newState.bluePoints : newState.redPoints;
  
  if (newScoringPoints === 40 && newOpponentPoints < 40) {
    // El que tiene 40 anotó y el rival no llegó a 40 aún
    // Pero necesita anotar OTRO punto para ganar
    // En realidad, si ya tenía 40 y el rival tiene menos, gana
  }

  return newState;
}

// Manejar puntos en situación de deuce
function handleDeucePoint(state: GameState, scoringTeam: Team, opponentTeam: Team): GameState {
  const newState = { ...state };

  switch (newState.deuceState) {
    case 'NONE':
      // Primera vez que llegamos a 40-40
      newState.deuceState = 'BP1';
      newState.isBreakPoint = true;
      newState.breakPointNumber = 1;
      break;

    case 'BP1':
      // Break point 1: alguien anota, pasa a ventaja
      newState.deuceState = 'ADV';
      newState.advantageTeam = scoringTeam;
      newState.isBreakPoint = false;
      break;

    case 'ADV':
      if (scoringTeam === newState.advantageTeam) {
        // El que tiene ventaja anota: gana el game
        newState.gameWonBy = scoringTeam;
      } else {
        // El rival anota: vuelve a break point (BP2)
        newState.deuceState = 'BP2';
        newState.advantageTeam = null;
        newState.isBreakPoint = true;
        newState.breakPointNumber = 2;
      }
      break;

    case 'BP2':
      // Break point 2: alguien anota, pasa a ventaja
      newState.deuceState = 'ADV';
      newState.advantageTeam = scoringTeam;
      newState.isBreakPoint = false;
      break;

    case 'GOLDEN':
      // Punto de oro: el que anota gana directo
      newState.gameWonBy = scoringTeam;
      break;
  }

  return newState;
}

// Verificar si un game está ganado
export function checkGameWin(gameState: GameState, scoringTeam: Team, previousState: GameState): boolean {
  // Si ya se determinó ganador en processPoint (casos de deuce)
  if (gameState.gameWonBy === scoringTeam) {
    return true;
  }

  const scoringPoints = scoringTeam === 'blue' ? gameState.bluePoints : gameState.redPoints;
  const opponentPoints = scoringTeam === 'blue' ? gameState.redPoints : gameState.bluePoints;
  const previousScoringPoints = scoringTeam === 'blue' ? previousState.bluePoints : previousState.redPoints;

  // Victoria normal: tenía 40, sigue en 40 (anotó estando en 40), y rival < 40
  if (previousScoringPoints === 40 && scoringPoints === 40 && opponentPoints < 40 && gameState.deuceState === 'NONE') {
    return true;
  }

  return false;
}

// Procesar punto a nivel de set
export function processSetPoint(setState: SetState, scoringTeam: Team): SetState {
  const newState = { ...setState };
  const previousGame = { ...newState.currentGame };
  
  // Procesar el punto en el game actual
  newState.currentGame = processPoint(newState.currentGame, scoringTeam);

  // Verificar si se ganó el game
  if (checkGameWin(newState.currentGame, scoringTeam, previousGame) || newState.currentGame.gameWonBy === scoringTeam) {
    // Sumar game al equipo ganador
    if (scoringTeam === 'blue') {
      newState.blueGames++;
    } else {
      newState.redGames++;
    }

    // Verificar si se ganó el set
    if (checkSetWin(newState)) {
      newState.setWonBy = scoringTeam;
    } else {
      // Resetear game para el siguiente
      newState.currentGame = resetGame(previousGame.servingTeam);
    }
  }

  return newState;
}

// Verificar si un set está ganado (6 games con diferencia de 2)
export function checkSetWin(setState: SetState): boolean {
  const { blueGames, redGames } = setState;
  
  // Necesita 6+ games con diferencia de 2
  if (blueGames >= 6 && blueGames - redGames >= 2) {
    return true;
  }
  if (redGames >= 6 && redGames - blueGames >= 2) {
    return true;
  }
  
  // TODO: Implementar tie-break en 6-6
  
  return false;
}

// Verificar si el partido está ganado (2 sets)
export function checkMatchWin(sets: SetState[]): Team | null {
  let blueSetsWon = 0;
  let redSetsWon = 0;

  for (const set of sets) {
    if (set.setWonBy === 'blue') blueSetsWon++;
    if (set.setWonBy === 'red') redSetsWon++;
  }

  if (blueSetsWon >= 2) return 'blue';
  if (redSetsWon >= 2) return 'red';
  
  return null;
}

// Procesar punto a nivel de partido
export function processMatchPoint(matchState: MatchState, scoringTeam: Team): MatchState {
  const newState = { ...matchState, sets: [...matchState.sets] };
  const currentSet = { ...newState.sets[newState.currentSetIndex] };
  
  // Procesar punto en el set actual
  const updatedSet = processSetPoint(currentSet, scoringTeam);
  newState.sets[newState.currentSetIndex] = updatedSet;

  // Actualizar estadísticas
  newState.stats = {
    blueGamesWon: newState.sets.reduce((acc, s) => acc + s.blueGames, 0),
    redGamesWon: newState.sets.reduce((acc, s) => acc + s.redGames, 0),
    blueSetsWon: newState.sets.filter(s => s.setWonBy === 'blue').length,
    redSetsWon: newState.sets.filter(s => s.setWonBy === 'red').length,
  };

  // Verificar si se ganó el set
  if (updatedSet.setWonBy) {
    // Verificar si se ganó el partido
    const matchWinner = checkMatchWin(newState.sets);
    if (matchWinner) {
      newState.matchWonBy = matchWinner;
    } else {
      // Iniciar nuevo set
      const lastServingTeam = updatedSet.currentGame.servingTeam;
      newState.sets.push(createSet(lastServingTeam === 'blue' ? 'red' : 'blue'));
      newState.currentSetIndex++;
    }
  }

  return newState;
}

// Obtener texto de puntuación actual
export function getScoreText(gameState: GameState): { blue: string; red: string } {
  if (gameState.deuceState === 'ADV') {
    if (gameState.advantageTeam === 'blue') {
      return { blue: 'ADV', red: '40' };
    } else {
      return { blue: '40', red: 'ADV' };
    }
  }

  if (gameState.deuceState !== 'NONE' && gameState.bluePoints === 40 && gameState.redPoints === 40) {
    return { blue: '40', red: '40' };
  }

  return {
    blue: gameState.bluePoints.toString(),
    red: gameState.redPoints.toString(),
  };
}

// Obtener texto descriptivo del estado de deuce
export function getBreakPointsText(state: GameState): string {
  switch (state.deuceState) {
    case 'BP1':
      return 'Break Point 1';
    case 'BP2':
      return 'Break Point 2';
    case 'ADV':
      return `Ventaja ${state.advantageTeam === 'blue' ? 'Azul' : 'Rojo'}`;
    case 'GOLDEN':
      return '¡Punto de Oro!';
    default:
      return '';
  }
}

// Verificar si estamos en deuce
export function isInDeuce(state: GameState): boolean {
  return state.deuceState !== 'NONE' || (state.bluePoints === 40 && state.redPoints === 40);
}
