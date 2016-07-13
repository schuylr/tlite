function tlite(getTooltipOpts) {
  document.addEventListener('mouseover', function (e) {
    var el = e.target;
    var opts = getTooltipOpts(el);

    if (!opts) {
      el = el.parentElement;
      opts = el && getTooltipOpts(el);
    }

    opts &&  tlite.show(el, opts, true);
  });

  document.addEventListener('touchstart', function (e) {
    var el = e.target;
    var opts = getTooltipOpts(el);

    if (!opts) {
      el = el.parentElement;
      opts = el && getTooltipOpts(el);
    }

    opts && tlite.show(el, opts, true) || tlite.hideAll(document.getElementsByClassName('tlite-visible'), true);
  });
}

tlite.show = function (el, opts, isAuto) {
  opts = opts || {};

  (el.tooltip || Tooltip(el, opts)).show();

  function Tooltip(el, opts) {
    var tooltipEl;
    var showTimer;
    var text;

    el.addEventListener('mouseleave', autoHide);

    function show() {
      text = el.title || text;
      el.title = '';
      text && !showTimer && (showTimer = setTimeout(fadeIn, isAuto ? 150 : 1))
    }

    function autoHide() {
      tlite.hide(el, true);
    }

    function hide(isAutoHiding) {
      if (isAuto === isAutoHiding) {
        showTimer = clearTimeout(showTimer);
        tooltipEl && el.removeChild(tooltipEl);

        tooltipEl = undefined;
      }
    }

    function fadeIn() {
      if (!tooltipEl) {
        tooltipEl = createTooltip(el, text, opts);
      }
    }

    return el.tooltip = {
      show: show,
      hide: hide
    };
  }

  function createTooltip(el, text, opts) {
    var tooltipEl = document.createElement('span');
    var grav = opts.grav || 'n';

    tooltipEl.className = 'tlite ' + (grav ? 'tlite-' + grav : '');
    tooltipEl.textContent = text;

    el.appendChild(tooltipEl);

    var arrowSize = 10;
    var top = el.offsetTop;
    var left = el.offsetLeft;

    if (tooltipEl.offsetParent === el) {
      top = left = 0;
    }

    var width = el.offsetWidth;
    var height = el.offsetHeight;
    var tooltipHeight = tooltipEl.offsetHeight;
    var tooltipWidth = tooltipEl.offsetWidth;
    var centerEl = left + (width / 2);
    var vertGrav = grav[0];
    var horzGrav = grav[1];

    tooltipEl.style.top = (
      vertGrav === 's' ? (top - tooltipHeight - arrowSize) :
      vertGrav === 'n' ? (top + height + arrowSize) :
      (top + (height / 2) - (tooltipHeight / 2))
    ) + 'px';

    tooltipEl.style.left = (
      horzGrav === 'w' ? left :
      horzGrav === 'e' ? left + width - tooltipWidth :
      vertGrav === 'w' ? (left + width + arrowSize) :
      vertGrav === 'e' ? (left - tooltipWidth - arrowSize) :
      (centerEl - tooltipWidth / 2)
    ) + 'px';

    tooltipEl.className += ' tlite-visible';

    return tooltipEl;
  }
};

tlite.hide = function (el, isAuto) {
  el.tooltip && el.tooltip.hide(isAuto);
};

tlite.hideAll = function(els, isAuto) {
  for (var i=0; i<els.length; i++) {
    el = els[i].parentElement;
    tlite.hide(el, isAuto);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = tlite;
}
