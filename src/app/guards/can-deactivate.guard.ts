import { CanDeactivateFn } from '@angular/router';

export const UnSavedChangesGuard: CanDeactivateFn<any> = (component, currentRoute, currentState, nextState) => {
  let canExitPage: boolean = false;

   canExitPage = component.navigatingAway;

   console.log(currentRoute, currentState, nextState);
  if (!canExitPage) {
    confirm('Do you want to leave?');
    return false;
  }

  return true;
};