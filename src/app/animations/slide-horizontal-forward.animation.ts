import { AnimationController } from '@ionic/angular';

export const slideHorizontalForwardAnimation = (baseEl: HTMLElement, opts?: any) => {
  const animationCtrl = new AnimationController();

  const ENTERING_EL = opts.enteringEl;
  const LEAVING_EL = opts.leavingEl;

  const DURATION = opts.duration || 500;
  const EASING = opts.easing || 'cubic-bezier(0.25, 0.1, 0.25, 1)';

  const enteringAnimation = animationCtrl.create()
    .addElement(ENTERING_EL)
    .beforeStyles({ opacity: 1 })
    .duration(DURATION)
    .easing(EASING)
    .fromTo('transform', 'translateX(100%)', 'translateX(0)');

  const leavingAnimation = LEAVING_EL
    ? animationCtrl.create()
        .addElement(LEAVING_EL)
        .duration(DURATION)
        .easing(EASING)
        .fromTo('transform', 'translateX(0)', 'translateX(-30%)')
        .fromTo('opacity', 1, 0.5)
    : null;

  const animation = animationCtrl.create().addAnimation([enteringAnimation]);

  if (leavingAnimation) {
    animation.addAnimation(leavingAnimation);
  }

  return animation;
};
