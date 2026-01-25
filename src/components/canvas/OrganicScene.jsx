import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettings } from '../../context/SettingsContext';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  
  uniform float uTime;
  
  // 3D Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    i = mod289(i);
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    
    // Create folds (Pliegues)
    // Low frequency, high amplitude for big folds
    float fold1 = snoise(vec3(uv.x * 0.8, uv.y * 0.8, uTime * 0.05)); 
    // Sharp ridges
    float fold2 = abs(snoise(vec3(uv.x * 2.5, uv.y * 2.0, uTime * 0.1)));
    // Fine details
    float fold3 = snoise(vec3(uv.x * 6.0, uv.y * 6.0, uTime * 0.15));
    
    // Combine for deeply folded cloth look
    float displacement = (fold1 * 1.5 - fold2 * 0.5 + fold3 * 0.1) * 2.0;
    
    // Pass to fragment for coloring based on height
    vDisplacement = displacement;
    
    pos.z += displacement;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  
  uniform float uTime;
  uniform float uGlobalAlpha; // Controlled by Zen Mode
  
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  uniform vec3 uColor6;

  float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Re-calculate normal based on derivatives for sharp lighting on folds
    vec3 X = dFdx(vPosition);
    vec3 Y = dFdy(vPosition);
    vec3 normal = normalize(cross(X, Y));
    
    vec3 viewDir = normalize(cameraPosition - vPosition);
    
    // Lighting for 3D Sensation
    // Main directional light approximation
    vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Strong Fresnel for the "Sheen" of the pliegues
    float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 2.0);
    
    // Color mixing based on displacement/height and screen gradients
    vec3 mix1 = mix(uColor1, uColor2, vUv.x + sin(uTime * 0.1)*0.2); 
    vec3 mix2 = mix(uColor3, uColor4, vUv.y + cos(uTime * 0.1)*0.2); 
    vec3 base = mix(mix1, mix2, 0.5);
    
    // Peaks get highlight color, valleys get darker
    float peak = smoothstep(-0.5, 1.5, vDisplacement);
    vec3 foldColor = mix(base * 0.8, uColor5, peak); // Shadows in valleys
    
    vec3 finalColor = foldColor;
    
    // Add specular highlight for plastic/metallic foil look
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
    finalColor += uColor6 * spec * 0.8;
    
    // Iridescent coating overlay
    vec3 iridescent = 0.5 + 0.5 * cos(3.14 * 2.0 * (normal.z + vec3(0.0, 0.1, 0.2)));
    finalColor = mix(finalColor, iridescent, fresnel * 0.4); 
    
    // Film Grain
    float grain = random(vUv + uTime) * 0.06;
    finalColor -= grain; 
    
    // Ensure it doesn't get too dark or washed out
    finalColor += diff * 0.1;

    gl_FragColor = vec4(finalColor, uGlobalAlpha);
  }
`;

const OrganicScene = () => {
  const meshRef = useRef();
  const { settings } = useSettings();
  const { viewport } = useThree(); // Get viewport size to fill screen

  // Define Palettes
  // UPDATED for Reference Images: Cyan, Pink, Purple, Pastel Rainbow
  const palettes = useMemo(() => {
    // Ethereal Color Pool
    const etherealColors = [
      '#d4c1ec', // Hazy Lavender
      '#9fb4c7', // Muted Blue-Grey
      '#e0b0ff', // Soft Mauve
      '#b8e1dd', // Pale Cyan
      '#ffdab9', // Peach
      '#ffffff', // White
      '#b0c4de', // Light Steel Blue
      '#dda0dd', // Plum
      '#add8e6', // Light Blue
      '#f08080', // Light Coral (muted)
      '#f5ced9', // Pale Pink
      '#c2d4f2', // Soft Periwinkle
    ];

    // Helper to get random unique colors
    const getRandomColors = (count) => {
      const shuffled = [...etherealColors].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(c => new THREE.Color(c));
    };

    return {
      clara: [
        new THREE.Color('#FFFFFF'),
        new THREE.Color('#F0F8FF'),
        new THREE.Color('#E6E6FA'),
        new THREE.Color('#FFFFFF'),
        new THREE.Color('#F5F5F5'),
        new THREE.Color('#FFFFFF'),
      ],
      traslúcido: getRandomColors(6), // Random selection on mount/reload
      oscura: [
        new THREE.Color('#000000'),
        new THREE.Color('#000000'),
        new THREE.Color('#050505'),
        new THREE.Color('#000000'),
        new THREE.Color('#111111'),
        new THREE.Color('#333333'),
      ],
      vapor: [
        new THREE.Color('#ff71ce'),
        new THREE.Color('#01cdfe'),
        new THREE.Color('#05ffa1'),
        new THREE.Color('#b967ff'),
        new THREE.Color('#fffb96'),
        new THREE.Color('#ff71ce'),
      ],
      terminal: [
        new THREE.Color('#000000'),
        new THREE.Color('#001100'),
        new THREE.Color('#002200'),
        new THREE.Color('#000000'),
        new THREE.Color('#00ff00'),
        new THREE.Color('#003300'),
      ]
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGlobalAlpha: { value: 1.0 },
      uColor1: { value: new THREE.Color() },
      uColor2: { value: new THREE.Color() },
      uColor3: { value: new THREE.Color() },
      uColor4: { value: new THREE.Color() },
      uColor5: { value: new THREE.Color() },
      uColor6: { value: new THREE.Color() },
    }),
    []
  );

  // Initialize/Update on theme change
  useEffect(() => {
    // Fallback to traslúcido if theme missing
    const target = palettes[settings.theme] || palettes['traslúcido'];

    // Setup initial colors or let frame loop handle lerp
    // We will just let the frame loop handle lerp for smoothness
  }, [settings.theme, palettes]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime * 0.1; // Even slower motion for ethereal feel

      // Zen Mode Opacity
      const targetAlpha = settings.zenMode ? 0.05 : 1.0;
      uniforms.uGlobalAlpha.value += (targetAlpha - uniforms.uGlobalAlpha.value) * 0.05;

      // Color Transition
      const targetPalette = palettes[settings.theme] || palettes['traslúcido'];
      const lerpSpeed = 0.02;

      uniforms.uColor1.value.lerp(targetPalette[0], lerpSpeed);
      uniforms.uColor2.value.lerp(targetPalette[1], lerpSpeed);
      uniforms.uColor3.value.lerp(targetPalette[2], lerpSpeed);
      uniforms.uColor4.value.lerp(targetPalette[3], lerpSpeed);
      uniforms.uColor5.value.lerp(targetPalette[4], lerpSpeed);
      uniforms.uColor6.value.lerp(targetPalette[5], lerpSpeed);
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Plane covers full view. Args: Width, Height, SegmentsX, SegmentsY */}
      {/* High segmentation for smooth folds */}
      <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5, 192, 192]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
export default OrganicScene;
