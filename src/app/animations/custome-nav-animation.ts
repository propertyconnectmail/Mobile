import { slideHorizontalForwardAnimation } from './slide-horizontal-forward.animation';
import { slideHorizontalBackAnimation } from './slide-horizontal-back.animation';

export const customNavAnimation = (baseEl: HTMLElement, opts: any) => {
  if (opts.direction === 'back') {
    return slideHorizontalBackAnimation(baseEl, opts);
  }
  return slideHorizontalForwardAnimation(baseEl, opts);
};