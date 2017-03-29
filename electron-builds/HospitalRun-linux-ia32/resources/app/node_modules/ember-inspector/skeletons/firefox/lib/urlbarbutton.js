/*global require: false, exports: false */
/*jslint forin: true, indent: 2 */

var winUtils = require("sdk/deprecated/window-utils"),
  winUtilsNew = require("sdk/window/utils"),
  UrlbarButton;

const { getNodeView } = require("sdk/view/core");

UrlbarButton = function (options) {
  "use strict";

  if (!options || !options.id) {
    return;
  }

  var windowTracker,
    // Methods used internally
    getContentDocument,
    // Methods exposed externally
    getButtons,
    setImage,
    setVisibility,
    getVisibility,
    remove;

  getContentDocument = function (windowElement) {
    var doc, pageWindow, pageTabBrowser;

    if (windowElement.gBrowser) {
      pageWindow = windowElement;
    } else {
      pageWindow = windowElement.ownerDocument.defaultView;
    }

    if (windowElement.tagName === 'tab') {
      pageTabBrowser = pageWindow.gBrowser.getBrowserForTab(windowElement);
      doc = pageTabBrowser.contentDocument;
    } else {
      doc = pageWindow.gBrowser.contentDocument;
    }

    return doc;
  };

  getButtons = function (href) {
    var button, window,
      elements = [];

    for (window in winUtils.browserWindowIterator()) {
      if (!href || (window.gBrowser && href === getContentDocument(window).location.href)) {
        button = window.document.getElementById(options.id);
        if (button) {
          elements.push(button);
        }
      }
    }

    return elements;
  };

  setImage = function (src, href) {
    getButtons(href).forEach(function (button) {
      button.src = src;
    });
  };

  setVisibility = function (show, href) {
    getButtons(href).forEach(function (button) {
      button.collapsed = !show;
    });
  };

  getVisibility = function (href) {
    var shown;

    getButtons(href).forEach(function (button) {
      shown = (shown || !button.collapsed) ? true : false;
    });

    return shown;
  };

  remove = function () {
	if (options.panel)
		options.panel.destroy();
    windowTracker.unload();
  };

  windowTracker = new winUtils.WindowTracker({
    onTrack: function (window) {
      var button, urlbarIcons;

      urlbarIcons = window.document.getElementById("urlbar-icons");

      if (urlbarIcons && winUtilsNew.isBrowser(window)) {
        button = window.document.getElementById(options.id);

        if (button) {
          button.parentNode.removeChild(button);
        }

        button = window.document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "image");

        button.id = options.id;
        button.className = "urlbar-icon";
        button.collapsed = true;

        if (options.tooltip) {
          button.setAttribute("tooltiptext", options.tooltip);
        }
        if (options.image) {
          button.setAttribute("src", options.image);
        }
        if (options.panel) {
          button.addEventListener("click", () => {
            options.panel.show(null, button);
          });
        }

        urlbarIcons.insertBefore(button, urlbarIcons.firstChild);
      }
    },
    onUntrack: function (window) {
      var button = window.document.getElementById(options.id);

      if (button) {
        button.parentNode.removeChild(button);
      }
    }
  });

  return {
    getButtons : getButtons,
    setImage : setImage,
    setVisibility : setVisibility,
    getVisibility : getVisibility,
    remove : remove
  };
};

exports.UrlbarButton = UrlbarButton;
