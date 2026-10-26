/* @ds-bundle: {"format":4,"namespace":"Sedin","components":[{"name":"Button"},{"name":"Chip"},{"name":"Input"},{"name":"Checkbox"},{"name":"Radio"},{"name":"Card"}]} */
(function () {
  var React = window.React, h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(p, keys) { var o = {}; for (var k in p) if (keys.indexOf(k) < 0) o[k] = p[k]; return o; }

  function Button(p) {
    var v = p.variant || 'primary';
    return h('button', Object.assign({ type: 'button' }, omit(p, ['variant', 'className']), {
      className: cx('sd-btn', 'sd-btn-' + v, p.className)
    }), p.children);
  }

  function Chip(p) {
    var tone = p.tone || 'operational';
    return h('span', Object.assign({}, omit(p, ['tone', 'live', 'className', 'children']), {
      className: cx('sd-chip', 'sd-chip-' + tone, p.className)
    }), p.live ? h('span', { className: 'sd-dot', 'aria-hidden': 'true' }) : null, p.children);
  }

  function Input(p) {
    return h('input', Object.assign({ type: 'text' }, omit(p, ['className']), { className: cx('sd-input', p.className) }));
  }

  function Checkbox(p) {
    var input = h('input', Object.assign({ type: 'checkbox' }, omit(p, ['label', 'className', 'children']), { className: 'sd-check-input' }));
    return h('label', { className: cx('sd-choice', p.className) }, input, h('span', { className: 'sd-check-box', 'aria-hidden': 'true' }), p.label || p.children);
  }

  function Radio(p) {
    var input = h('input', Object.assign({ type: 'radio' }, omit(p, ['label', 'className', 'children']), { className: 'sd-radio-input' }));
    return h('label', { className: cx('sd-choice', p.className) }, input, h('span', { className: 'sd-radio-dot', 'aria-hidden': 'true' }), p.label || p.children);
  }

  function Card(p) {
    var lvl = p.elevation || 'card';
    return h('div', Object.assign({}, omit(p, ['accent', 'elevation', 'className', 'children']), {
      className: cx('sd-card', 'sd-card-' + lvl, p.accent && 'sd-card-accent', p.className)
    }), p.children);
  }

  window.Sedin = Object.assign(window.Sedin || {}, { Button: Button, Chip: Chip, Input: Input, Checkbox: Checkbox, Radio: Radio, Card: Card });
})();
