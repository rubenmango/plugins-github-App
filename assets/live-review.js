/**
 * Live review chrome stepper — vanilla port of ReviewActionBar + DiagramBranchPill tones.
 * Seeds: pending · ready · pushing · success · merged · error
 */
(function () {
  const stages = ['pending', 'ready', 'pushing', 'success', 'merged', 'error'];
  let stage = 'pending';

  const root = () => document.getElementById('live-review');
  const toast = (msg) => {
    const el = document.getElementById('live-toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.hidden = true;
    }, 1800);
  };

  function pillHTML(tone, withDiff) {
    if (tone === 'merged') {
      return `<button type="button" class="lr-pill merged" data-tone="merged">#356 <span class="lr-ico merge" aria-hidden="true"></span></button>`;
    }
    if (withDiff) {
      return `<button type="button" class="lr-pill review" data-tone="review">#356 <span class="add">+6</span> <span class="rm">-0</span> <span class="lr-ico pr" aria-hidden="true"></span></button>`;
    }
    return `<button type="button" class="lr-pill review" data-tone="review">#356 <span class="lr-ico pr" aria-hidden="true"></span></button>`;
  }

  function barHTML() {
    if (stage === 'pending') {
      return `<div class="lr-bar" data-stage="review">
        <button type="button" class="lr-btn ghost" data-act="discard">Discard</button>
        <button type="button" class="lr-btn primary" data-act="approve">Approve <span class="kbd">⌘⏎</span></button>
      </div>`;
    }
    if (stage === 'ready') {
      return `<div class="lr-bar" data-stage="ready">
        <button type="button" class="lr-btn secondary" data-act="push">Push to repo <span class="kbd green">⌘⏎</span></button>
        <span class="lr-chip review">#356 <span class="lr-ico pr"></span></span>
      </div>`;
    }
    if (stage === 'pushing') {
      return `<div class="lr-bar" data-stage="pushing">
        <span class="lr-label">Pushing..</span>
        <span class="lr-chip review">#356 <span class="lr-ico pr"></span></span>
      </div>`;
    }
    if (stage === 'success') {
      return `<div class="lr-bar" data-stage="success">
        <span class="lr-label">Pushed to</span>
        <span class="lr-chip open">#356 <span class="lr-ico pr-purple"></span></span>
      </div>`;
    }
    if (stage === 'merged') {
      return `<div class="lr-bar quiet" data-stage="merged">
        <span class="lr-label muted">Merged on main</span>
        ${pillHTML('merged', false)}
      </div>`;
    }
    return `<div class="lr-bar" data-stage="error">
      <span class="lr-label">Unable to push</span>
      <span class="lr-chip err">#356</span>
    </div>`;
  }

  function render() {
    const el = root();
    if (!el) return;
    const withDiff = stage === 'pending';
    const tone = stage === 'merged' || stage === 'success' ? (stage === 'merged' ? 'merged' : 'review') : 'review';
    // After success, pill still green until merged seed; merged seed uses purple merge.
    const pillTone = stage === 'merged' ? 'merged' : 'review';
    el.innerHTML = `
      <div class="lr-stage">
        <div class="lr-top">
          <div class="lr-name">pr-review-architecture</div>
          ${pillHTML(pillTone, withDiff)}
        </div>
        <div class="lr-canvas" aria-hidden="true">
          <div class="lr-node">GitTrailerDetector</div>
          <div class="lr-node added">OpenReview</div>
          <div class="lr-node added">DiffView</div>
        </div>
        <div class="lr-bottom">
          <button type="button" class="lr-ai" data-act="sparkle" title="AI">✦</button>
          ${stage === 'merged' || stage === 'success' ? '' : ''}
        </div>
        <div class="lr-action-dock">${barHTML()}</div>
      </div>`;
    el.querySelectorAll('[data-act]').forEach((btn) => {
      btn.addEventListener('click', () => onAct(btn.getAttribute('data-act')));
    });
    document.querySelectorAll('[data-seed]').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-seed') === stage);
    });
  }

  function onAct(act) {
    if (act === 'approve') {
      stage = 'ready';
      toast('Approved — ready to push');
    } else if (act === 'push') {
      stage = 'pushing';
      render();
      toast('Pushing…');
      setTimeout(() => {
        stage = 'success';
        render();
        toast('Pushed to #356');
        setTimeout(() => {
          stage = 'merged';
          render();
          toast('Merged status on pill + dashboard');
        }, 1000);
      }, 900);
      return;
    } else if (act === 'discard') {
      stage = 'pending';
      toast('Hard discard exits review in product');
    } else if (act === 'sparkle') {
      toast('Soft-dismiss — click #356 pill to restart');
    }
    render();
  }

  function setStage(s) {
    if (!stages.includes(s)) return;
    stage = s;
    render();
    toast('Seed: ' + s);
  }

  window.LiveReview = { setStage, render, stages };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-seed]').forEach((b) => {
      b.addEventListener('click', () => setStage(b.getAttribute('data-seed')));
    });
    render();
  });
})();
