css = """/* LOADER WRAPPER */
#loader-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--night);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.8s ease, visibility 0.8s ease;
}
#loader-wrapper.hidden {
  opacity: 0;
  visibility: hidden;
}
.loader {
  --duration: 3s;
  --primary: var(--champagne);
  --primary-light: #d6b97c;
  --primary-rgba: rgba(195, 163, 98, 0);
  width: 200px;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
}

@media (max-width: 480px) {
  .loader {
    zoom: 0.44;
  }
}

.loader:before, .loader:after {
  --r: 20.5deg;
  content: "";
  width: 320px;
  height: 140px;
  position: absolute;
  right: 32%;
  bottom: -11px;
  background: var(--night);
  transform: translateZ(200px) rotate(var(--r));
  animation: mask var(--duration) linear forwards infinite;
}
.loader:after {
  --r: -20.5deg;
  right: auto;
  left: 32%;
}

.loader .ground {
  position: absolute;
  left: -50px;
  bottom: -120px;
  transform-style: preserve-3d;
  transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
}
.loader .ground div {
  transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0);
  width: 200px;
  height: 200px;
  background: var(--primary);
  background: linear-gradient(45deg, var(--primary) 0%, var(--primary) 50%, var(--primary-light) 50%, var(--primary-light) 100%);
  transform-style: preserve-3d;
  animation: ground var(--duration) linear forwards infinite;
}
.loader .ground div:before, .loader .ground div:after {
  --rx: 90deg;
  --ry: 0deg;
  --x: 44px;
  --y: 162px;
  --z: -50px;
  content: "";
  width: 156px;
  height: 300px;
  opacity: 0;
  background: linear-gradient(var(--primary), var(--primary-rgba));
  position: absolute;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y)) translateZ(var(--z));
  animation: ground-shine var(--duration) linear forwards infinite;
}
.loader .ground div:after {
  --rx: 90deg;
  --ry: 90deg;
  --x: 0;
  --y: 177px;
  --z: 150px;
}

.loader .box {
  --x: 0;
  --y: 0;
  position: absolute;
  animation: var(--duration) linear forwards infinite;
  transform: translate(var(--x), var(--y));
}

.loader .box div {
  background:
  linear-gradient(var(--emerald-deep), var(--emerald-deep)),
  repeating-linear-gradient(
    90deg,
    rgba(255,255,255,0.15) 0px,
    rgba(255,255,255,0.15) 4px,
    transparent 4px,
    transparent 12px
  ),
  repeating-linear-gradient(
    rgba(255,255,255,0.15) 0px,
    rgba(255,255,255,0.15) 4px,
    transparent 4px,
    transparent 12px
  );
  width: 48px;
  height: 48px;
  position: relative;
  transform-style: preserve-3d;
  animation: var(--duration) ease forwards infinite;
  transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
}
.loader .box div:before, .loader .box div:after {
  --rx: 90deg;
  --ry: 0deg;
  --z: 24px;
  --y: -24px;
  --x: 0;
  content: "";
  position: absolute;
  background: inherit;
  width: inherit;
  height: inherit;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y)) translateZ(var(--z));
  filter: brightness(var(--b, 1.2));
}
.loader .box div:after {
  --rx: 0deg;
  --ry: 90deg;
  --x: 24px;
  --y: 0;
  --b: 1.4;
}

/* BOX POSITIONS */
.loader .box.box0 { left: 58px; top: 108px; --x: -220px; --y: -120px; }
.loader .box.box1 { left: 25px; top: 120px; --x: -260px; --y: 120px; }
.loader .box.box2 { left: 58px; top: 64px; --x: 120px; --y: -190px; }
.loader .box.box3 { left: 91px; top: 120px; --x: 280px; --y: -40px; }

.loader .box.box4 { left: 58px; top: 132px; --x: 60px; --y: 200px; }
.loader .box.box5 { left: 25px; top: 76px; --x: -220px; --y: -120px; }
.loader .box.box6 { left: 91px; top: 76px; --x: -260px; --y: 120px; }
.loader .box.box7 { left: 58px; top: 87px; --x: -240px; --y: 200px; }
"""

for i in range(8):
    css += f'''
.loader .box{i} {{ animation-name: box-move{i}; }}
.loader .box{i} div {{ animation-name: box-scale{i}; }}

@keyframes box-move{i} {{
  {i*4}% {{ transform: translate(var(--x), var(--y)); }}
  {i*4 + 13}%, 52% {{ transform: translate(0, 0); }}
  80% {{ transform: translate(0, -32px); }}
  90%, 100% {{ transform: translate(0, 188px); }}
}}

@keyframes box-scale{i} {{
  {max(0, i*4 - 6)}% {{ transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); }}
  {i*4 + 2}%, 100% {{ transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); }}
}}
'''

css += '''
@keyframes ground {
  0%, 65% { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0); }
  75%, 90% { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(1); }
  100% { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0); }
}
@keyframes ground-shine {
  0%, 70% { opacity: 0; }
  75%, 87% { opacity: 0.2; }
  100% { opacity: 0; }
}
@keyframes mask {
  0%, 65% { opacity: 0; }
  66%, 100% { opacity: 1; }
}
'''
with open('c:\\Users\\Nirav\\OneDrive\\Desktop\\real-estate-website\\frontend\\loader.css', 'w', encoding='utf-8') as f:
    f.write(css)
