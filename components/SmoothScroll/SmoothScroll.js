const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

const scrollTo = (element, to, duration) => {
  var start = element.scrollTop,
    change = to - start + document.getElementById("document-body").offsetTop + 350,
    currentTime = 0,
    increment = 20;


    var animateScroll = function () {
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
};


const changeBackground = (target) => {
  var currentTime = 0, 
  increment = 20, 
  opacity = 0.82, 
  duration = 900, 
  delay = 900;

  var opacityChangingFor = opacity / (duration / increment);
  target.style.background = `rgba(254,255,193,${opacity})`;

  var animateBackground = function () {
    currentTime += increment;
    if (currentTime > delay) opacity -= opacityChangingFor;
    target.style.background = `rgba(254,255,193,${opacity})`;
    if (opacity > 0) {
      setTimeout(animateBackground, increment);
    }
  }

  animateBackground();
}

export default function smoothScroll(target) {
  var targetScroll = document.getElementById(target);
  var targetOffset = targetScroll.offsetTop;
  if (target === 'start') targetOffset -= 200; // don't ask
  scrollTo(document.documentElement, targetOffset, 900);
  if (target !== 'start')  changeBackground(targetScroll);
}
