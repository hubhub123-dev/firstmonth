(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  // Exact user-selected seconds at the default Quick pace.
  const scenes = window.LETTER_SCENES.map(scene => ({ ...scene, duration: scene.seconds }));
  const starts = []; let total = 0;
  scenes.forEach(scene => { starts.push(total); total += scene.duration; });
  total = Math.ceil(total * 10) / 10; // Keep the end exactly reachable by the slider's 0.1-second steps.
  const audio = $('audio');
  let position = 0, current = -1, playing = false, started = false, lastFrame = 0;
  let frame = 0, pace = Number($('pace').value), audioReady = false, toastTimer;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const esc = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Only local assets are needed. The soundtrack is set in music.js.
  audio.volume = 0.65;
  if (window.SOUNDTRACK) audio.src = window.SOUNDTRACK;
  audio.addEventListener('loadedmetadata', () => {
    audioReady = true;
    syncSoundtrack();
    if (playing) playAudio();
  });
  audio.addEventListener('error', () => {
    audioReady = false;
    if (playing) toast('The song couldn’t load. You can still enjoy the story.');
  });
  function playAudio() {
    if (!audio.src) return;
    const attempt = audio.play();
    if (attempt) attempt.catch(() => {
      if (!playing) return;
      toast(audio.error ? 'The song couldn’t load. You can still enjoy the story.' : 'Tap Pause, then Play, to start the music.');
    });
  }
  function syncSoundtrack() {
    if (!audioReady || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    // The displayed clock accounts for reading pace; the song uses that same time.
    audio.currentTime = (position / pace) % audio.duration;
  }
  function toast(message) {
    $('toast').textContent = message; $('toast').hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 5000);
  }

  function photo(name) {
    const replacements = {
      'scene-memory-1': { width:707, height:1536, alt:'Khai smiling during a video call with Ashford', caption:'my kind of happy ♡' },
      'scene-memory-2': { width:1170, height:2080, alt:'Khai wearing a gray beret and black top', caption:'always choosing you' },
      'scene-memory-3': { width:1906, height:3480, alt:'Khai seated beside wooden shelves', caption:'and then, there was you' },
      'scene-memory-4': { width:707, height:1536, alt:'A close-up selfie of Khai with a gold necklace', caption:'so glad I found you ♡' },
      'scene-memory-5': { width:1170, height:2058, alt:'Khai making a playful face in a selfie', caption:'the little things ♡' },
      'scene-memory-6': { width:1320, height:1178, alt:'Khai posing with her hand beside her head', caption:'my kind of happy' },
      'scene-memory-7': { width:666, height:1077, alt:'Khai seated in a silver outfit and a fluffy white jacket', caption:'my inspiration ♡' }
    };
    const replacement = replacements[name];
    if (replacement) return `<figure class="scene-photo full-photo"><img src="assets/${name}.jpg" width="${replacement.width}" height="${replacement.height}" alt="${replacement.alt}"><figcaption>${replacement.caption}</figcaption></figure>`;
    const caption = name === 'her' ? 'my favorite person ♡' : 'always choosing you';
    const alt = name === 'her' ? 'Your darling wearing glasses and a heart necklace' : 'You in front of the green Siargao mountains';
    return `<figure class="scene-photo"><img src="assets/${name}.jpg" width="720" height="720" alt="${alt}"><figcaption>${caption}</figcaption></figure>`;
  }
  function duo() {
    return `<div class="scene-duo" aria-label="Our photos together"><figure class="polaroid photo-him"><div class="photo-window"><img src="assets/him.jpg" alt="You in Siargao" width="720" height="720"></div><figcaption>you &amp; me</figcaption></figure><figure class="polaroid photo-her"><div class="photo-window"><img src="assets/her.jpg" alt="Your darling" width="1320" height="1320"></div><figcaption>my favorite story</figcaption></figure></div>`;
  }
  function memories(isRoblox = false) {
    if (isRoblox) return `<div class="scene-memories roblox-memories" aria-label="Our Roblox memories"><figure><img src="assets/roblox-1.jpg" width="1080" height="499" alt="Ashford and Khai playing Roblox together"><figcaption>where our story started ♡</figcaption></figure><figure><img src="assets/roblox-2.jpg" width="1080" height="499" alt="Our Roblox avatars climbing the steps together"><figcaption>every adventure, with you</figcaption></figure></div>`;
    return `<div class="scene-memories" aria-label="Our video call memories"><figure><img src="assets/call-aug22.jpg" width="707" height="1536" alt="Ashford and Khai on a video call, saved on August 22"><figcaption>little moments ♡</figcaption></figure><figure><img src="assets/call-aug25.jpg" width="707" height="1536" alt="Khai and Ashford on a video call, saved on August 25"><figcaption>so much happiness</figcaption></figure></div>`;
  }
  function syncSceneVideo(seek = false) {
    const clip = $('scene-video');
    if (!clip) return;
    clip.muted = true;
    if (seek && Number.isFinite(clip.duration) && clip.duration > 0) {
      clip.currentTime = Math.max(0, (position - starts[current]) / pace) % clip.duration;
    }
    if (playing) {
      clip.play().catch(() => {
        if (playing && clip.isConnected && !clip.error) toast('Tap Pause, then Play, to start the clip.');
      });
    } else clip.pause();
  }
  function render(index) {
    current = index;
    const scene = scenes[index];
    const centered = ['opening', 'statement', 'clock', 'poem', 'finale', 'letter'].includes(scene.kind);
    const element = $('scene');
    element.className = `scene ${centered ? 'centered' : ''} ${scene.kind || ''}`;
    const copy = `<div class="scene-copy"><h2>${esc(scene.title)}</h2><p lang="fil">${esc(scene.text)}</p>${scene.kind === 'finale' ? '<div class="final-actions"><button class="primary" id="replay">Watch it again ♡</button><button class="secondary" id="final-letter">Keep reading the letter</button></div>' : ''}</div>`;
    const visual = scene.kind === 'video'
      ? '<figure class="scene-photo scene-video-frame"><video id="scene-video" src="assets/inspiration.mp4" muted loop playsinline preload="metadata" aria-label="Our shared video clip">Your browser cannot play this clip.</video><figcaption>my inspiration ♡</figcaption></figure>'
      : scene.kind === 'letter' ? '' : scene.kind === 'finale'
      ? '<div class="mini-duo"><img src="assets/him.jpg" width="90" height="90" alt="You"><img src="assets/her.jpg" width="90" height="90" alt="Your darling"></div>'
      : centered ? '<span class="heart-mark" aria-hidden="true">♡</span>' : scene.kind === 'roblox' ? memories(true) : scene.kind === 'memories' ? memories() : scene.kind === 'duo' ? duo() : photo(scene.photo || 'her');
    $('scene-video')?.pause();
    element.innerHTML = centered ? visual + copy : copy + visual;
    const clip = $('scene-video');
    if (clip) {
      clip.addEventListener('loadedmetadata', () => { if (clip.isConnected) syncSceneVideo(true); });
      clip.addEventListener('error', () => {
        if (clip.isConnected) clip.nextElementSibling.textContent = 'This clip couldn’t load.';
      });
    }
    void element.offsetWidth;
    element.classList.add('is-entering');
    $('chapter-label').textContent = scene.chapter;
    $('scene-number').textContent = `${String(index + 1).padStart(2, '0')} / ${scenes.length}`;
    $('scene-announcement').textContent = `Scene ${index + 1} of ${scenes.length}: ${scene.title}`;
    $('previous').disabled = index === 0;
    $('next').disabled = index === scenes.length - 1;
    if ($('replay')) $('replay').onclick = restart;
    if ($('final-letter')) $('final-letter').onclick = () => openDialog('letter-dialog');
  }
  function update() {
    let index = scenes.length - 1;
    for (let i = 0; i < scenes.length; i++) {
      if (position < starts[i] + scenes[i].duration) { index = i; break; }
    }
    if (index !== current) render(index);
    $('timeline').value = position;
    $('timeline').style.setProperty('--progress', `${position / total * 100}%`);
    $('timeline').setAttribute('aria-valuetext', `${formatTime(position / pace)} of ${formatTime(total / pace)}, ${scenes[index].title}`);
    $('time').textContent = `${formatTime(position / pace)} / ${formatTime(total / pace)}`;
  }
  function tick(now) {
    if (!playing) return;
    if (lastFrame) position = Math.min(total, position + Math.min((now - lastFrame) / 1000, 0.25) * pace);
    lastFrame = now;
    update();
    if (position >= total) { setPlaying(false); return; }
    frame = requestAnimationFrame(tick);
  }
  function setPlaying(value) {
    playing = value;
    cancelAnimationFrame(frame);
    lastFrame = 0;
    document.body.classList.toggle('paused', !value);
    $('play').textContent = value ? 'Pause' : position >= total ? 'Replay' : 'Play';
    $('play').setAttribute('aria-label', value ? 'Pause presentation' : position >= total ? 'Replay presentation' : 'Play presentation');
    if (value) { playAudio(); frame = requestAnimationFrame(tick); }
    else audio.pause();
    syncSceneVideo();
  }
  function goTo(value) {
    position = Math.max(0, Math.min(total, value));
    // Scrubbing moves the scenes and music together without changing play/pause state.
    lastFrame = 0; update();
    syncSoundtrack();
    syncSceneVideo(true);
    if (position >= total) setPlaying(false);
  }
  function restart() {
    goTo(0);
    setPlaying(true);
  }
  function start() {
    started = true;
    $('cover').hidden = true; $('film').hidden = false;
    update();
    $('play').focus({ preventScroll: true });
    window.scrollTo(0, 0);
    setPlaying(true);
  }
  $('timeline').max = total;
  $('start').onclick = start;
  $('play').onclick = () => position >= total ? restart() : setPlaying(!playing);
  // Every navigation control moves the scenes, soundtrack, and clip together.
  $('previous').onclick = () => goTo(starts[Math.max(0, current - 1)]);
  $('next').onclick = () => goTo(starts[Math.min(scenes.length - 1, current + 1)]);
  $('timeline').addEventListener('input', event => goTo(Number(event.target.value)));
  $('pace').onchange = event => { pace = Number(event.target.value); lastFrame = 0; update(); syncSoundtrack(); syncSceneVideo(true); };
  document.addEventListener('keydown', event => {
    if (!started || document.querySelector('dialog[open]') || /INPUT|SELECT|TEXTAREA|BUTTON|A/.test(event.target.tagName)) return;
    if (event.code === 'Space') { event.preventDefault(); position >= total ? restart() : setPlaying(!playing); }
    if (event.code === 'ArrowRight') { event.preventDefault(); goTo(starts[Math.min(scenes.length - 1, current + 1)]); }
    if (event.code === 'ArrowLeft') { event.preventDefault(); goTo(starts[Math.max(0, current - 1)]); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) setPlaying(false); });

  // Native dialogs provide keyboard focus trapping and Escape-to-close.
  function openDialog(id) {
    const dialog = $(id);
    dialog.dataset.resume = String(playing);
    setPlaying(false); dialog.showModal();
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      if (dialog.dataset.resume === 'true' && started && !document.hidden) setPlaying(true);
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });
  document.querySelectorAll('[data-close]').forEach(button => button.onclick = () => $(button.dataset.close).close());
  $('letter-button').onclick = () => openDialog('letter-dialog');
  // Both views use the same letter text, including requested edits.
  const paragraphGroups = [[0], [1,2,3], [4,5], [6], [7,8,9], [10,11,12], [13,14], [15], [16], [17]];
  $('full-letter').innerHTML = paragraphGroups.map(group => `<p lang="fil"${group[0] === 15 ? ' class="poem"' : ''}>${esc(group.map(i => scenes[i].text).join(' '))}</p>`).join('');
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  try { savedTheme = localStorage.getItem('monthsary-theme'); } catch {}
  setTheme(savedTheme || (systemTheme.matches ? 'dark' : 'light'));
  systemTheme.addEventListener('change', event => { if (!savedTheme) setTheme(event.matches ? 'dark' : 'light'); });
  // A few rising hearts echo the closing promise without obscuring the letter.
  if (!reducedMotion.matches) {
    const container = document.querySelector('.petals');
    for (let i = 0; i < 8; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal'; petal.textContent = '♡';
      petal.style.cssText = `--x:${8 + i * 12}%;--duration:${19 + i * 2}s;--delay:-${i * 4}s`;
      container.appendChild(petal);
    }
  }
})();
