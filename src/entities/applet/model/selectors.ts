import { createSelector } from '@reduxjs/toolkit';

const selectApplets = (state: RootState) => state.applets;

export const selectInProgressApplets = createSelector(
  selectApplets,
  applet => applet.inProgress,
);

export const selectCompletedEntities = createSelector(
  selectApplets,
  applet => applet.completedEntities,
);
