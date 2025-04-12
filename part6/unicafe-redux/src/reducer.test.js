import deepFreeze from 'deep-freeze';
import counterReducer from './reducer';

describe('unicafe reducer', () => {
  const initialState = { good: 0, ok: 0, bad: 0 };

  test('should return a proper initial state when called with undefined state', () => {
    const newState = counterReducer(undefined, { type: 'DO_NOTHING' });
    expect(newState).toEqual(initialState);
  });

  test('good is incremented', () => {
    const state = initialState;
    deepFreeze(state);
    const newState = counterReducer(state, { type: 'GOOD' });
    expect(newState).toEqual({ good: 1, ok: 0, bad: 0 });
  });

  test('ok is incremented', () => {
    const state = initialState;
    deepFreeze(state);
    const newState = counterReducer(state, { type: 'OK' });
    expect(newState).toEqual({ good: 0, ok: 1, bad: 0 });
  });

  test('bad is incremented', () => {
    const state = initialState;
    deepFreeze(state);
    const newState = counterReducer(state, { type: 'BAD' });
    expect(newState).toEqual({ good: 0, ok: 0, bad: 1 });
  });

  test('state is reset', () => {
    const state = counterReducer(initialState, { type: 'GOOD' });
    deepFreeze(state);
    const newState = counterReducer(state, { type: 'ZERO' });
    expect(newState).toEqual({ good: 0, ok: 0, bad: 0 });
  });
});
