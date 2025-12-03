import { type FC, useEffect, useRef, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { AvatarAnimations, FacialExpressions, LipSyncCorresponding, type LipSync, type Message } from './Model.types';

const MODEL_URL = 'https://foxinostorage.blob.core.windows.net/static/games/models/Foxino_model_ver_10.glb';

type Props = {
  message: Message | undefined;
  currentAudioTime: number;
  onRender?: () => void;
};

try {
  useGLTF.preload(MODEL_URL, true, true);
} catch (error) {
  console.error('Error preloading model:', error);
}

export const Model: FC<Props> = ({ message, currentAudioTime, onRender }) => {
  const { nodes, materials, scene, animations } = useGLTF(MODEL_URL, true, true);

  const groupRef = useRef<THREE.Group>(null);
  const setupMode = useRef(false).current;

  const { actions, mixer } = useAnimations(animations, groupRef);

  const [lipsync, setLipsync] = useState<LipSync | undefined>(message?.lipSync || undefined);
  const [animation, setAnimation] = useState<string>(
    animations.find((a) => a.name === AvatarAnimations[a.name])?.name || animations[0]?.name,
  );
  const [facialExpression, setFacialExpression] = useState<string>('');

  const findAnimation = (name: string) => {
    const animation = animations.find((a) => a.name === name);

    if (animation) {
      return animation.name;
    } else {
      return animations.find((a) => a.name === AvatarAnimations[name])?.name || animations[0]?.name || '';
    }
  };

  useEffect(() => {
    if (!message) {
      setAnimation(findAnimation(AvatarAnimations.Animation_Idle_Orc));
      setFacialExpression('');
      return;
    }

    if (message.animation) {
      setAnimation(message.animation);
    }

    setFacialExpression(message.facialExpression || '');
    setLipsync(message.lipSync || undefined);
  }, [message]);

  useEffect(() => {
    if (nodes) {
      onRender?.();
    }
  }, [nodes]);

  useEffect(() => {
    if (actions[animation]) {
      actions[animation]
        .reset()
        .fadeIn(mixer['stats'].actions.inUse === 0 ? 0 : 0.5)
        .play();
    }
    return () => {
      if (actions[animation]) {
        actions[animation].fadeOut(0.5);
      }
    };
  }, [animation]);

  useEffect(() => {
    scene.traverse((node) => {
      if (node['isMesh']) {
        node['material'].transparent = false;
        node['material'].opacity = 1;
        node['material'].depthWrite = true;
        node['material'].side = THREE.FrontSide;

        if (node['material'].color) {
          if (node['material'].color.r === 0 && node['material'].color.g === 0 && node['material'].color.b === 0) {
            node['material'].color.set('white');
          }
        }
      }
    });
  }, []);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse((child) => {
      if (child['isSkinnedMesh'] && child['morphTargetDictionary']) {
        const index = child['morphTargetDictionary'][target];
        if (index === undefined || child['morphTargetInfluences'][index] === undefined) {
          return;
        }
        child['morphTargetInfluences'][index] = THREE.MathUtils.lerp(
          child['morphTargetInfluences'][index],
          value,
          speed,
        );
      }
    });
  };

  useFrame(() => {
    if (setupMode) {
      return;
    }

    const targetFacialExpression = facialExpression;
    Object.values(FacialExpressions).forEach((name) => {
      if (name === targetFacialExpression) {
        lerpMorphTarget(name, 1, 0.1);
      } else {
        lerpMorphTarget(name, 0, 0.1);
      }
    });

    const appliedMorphTargets: LipSyncCorresponding[] = [];
    if (message && lipsync) {
      lipsync.mouthCues.forEach((mouthCue) => {
        const startTime = mouthCue.start;
        const endTime = mouthCue.end;

        if (currentAudioTime >= startTime && currentAudioTime <= endTime) {
          appliedMorphTargets.push(LipSyncCorresponding[mouthCue.value]);
          lerpMorphTarget(LipSyncCorresponding[mouthCue.value], 1, 0.2);
        }
      });
    }

    Object.values(LipSyncCorresponding).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });
  });

  return (
    <group ref={groupRef} dispose={null}>
      <group name="Scene">
        <group name="root" scale={0.1}>
          <primitive object={nodes['pelvis']} />

          <primitive object={nodes['ik_foot_root']} />

          <primitive object={nodes['ik_hand_root']} />

          <skinnedMesh
            name="Gloves"
            geometry={nodes['Gloves']['geometry']}
            material={materials['Material #163']}
            skeleton={nodes['Gloves']['skeleton']}
          />

          <skinnedMesh
            name="Hair_1"
            geometry={nodes['Hair_1']['geometry']}
            material={materials['Material #163.001']}
            skeleton={nodes['Hair_1']['skeleton']}
          />

          <skinnedMesh
            name="Hair_2"
            geometry={nodes['Hair_2']['geometry']}
            material={materials['Material #163.001']}
            skeleton={nodes['Hair_2']['skeleton']}
          />

          <skinnedMesh
            name="Hair_3"
            geometry={nodes['Hair_3']['geometry']}
            material={materials['Material #163.001']}
            skeleton={nodes['Hair_3']['skeleton']}
          />

          <group name="Hoodie">
            <skinnedMesh
              name="Hoodie_1"
              geometry={nodes['Hoodie_1']['geometry']}
              material={materials['cs_blend_red.003']}
              skeleton={nodes['Hoodie_1']['skeleton']}
            />

            <skinnedMesh
              name="Hoodie_2"
              geometry={nodes['Hoodie_2']['geometry']}
              material={materials['Material #135.004']}
              skeleton={nodes['Hoodie_2']['skeleton']}
            />
          </group>

          <skinnedMesh
            name="Moustache"
            geometry={nodes['Moustache']['geometry']}
            material={materials['Foxino Black.001']}
            skeleton={nodes['Moustache']['skeleton']}
          />

          <group name="Shoes">
            <skinnedMesh
              name="Shoes_1"
              geometry={nodes['Shoes_1']['geometry']}
              material={materials['wire_204204204']}
              skeleton={nodes['Shoes_1']['skeleton']}
            />

            <skinnedMesh
              name="Shoes_2"
              geometry={nodes['Shoes_2']['geometry']}
              material={materials['Material']}
              skeleton={nodes['Shoes_2']['skeleton']}
            />

            <skinnedMesh
              name="Shoes_3"
              geometry={nodes['Shoes_3']['geometry']}
              material={materials['Material.001']}
              skeleton={nodes['Shoes_3']['skeleton']}
            />

            <skinnedMesh
              name="Shoes_4"
              geometry={nodes['Shoes_4']['geometry']}
              material={materials['Material.002']}
              skeleton={nodes['Shoes_4']['skeleton']}
            />
          </group>

          <group name="Tail">
            <skinnedMesh
              name="Tail_1"
              geometry={nodes['Tail_1']['geometry']}
              material={materials['Purple']}
              skeleton={nodes['Tail_1']['skeleton']}
            />

            <skinnedMesh
              name="Tail_2"
              geometry={nodes['Tail_2']['geometry']}
              material={materials['Purple']}
              skeleton={nodes['Tail_2']['skeleton']}
            />
          </group>

          <skinnedMesh
            name="Trousers"
            geometry={nodes['Trousers']['geometry']}
            material={materials['Material #135.001']}
            skeleton={nodes['Trousers']['skeleton']}
          />

          <skinnedMesh
            name="Eye_L"
            geometry={nodes['Eye_L']['geometry']}
            material={materials['Material_#61.002']}
            skeleton={nodes['Eye_L']['skeleton']}
            morphTargetDictionary={nodes['Eye_L']['morphTargetDictionary']}
            morphTargetInfluences={nodes['Eye_L']['morphTargetInfluences']}
          />

          <skinnedMesh
            name="Eye_Lid_L_Lower"
            geometry={nodes['Eye_Lid_L_Lower']['geometry']}
            material={materials['Purple']}
            skeleton={nodes['Eye_Lid_L_Lower']['skeleton']}
            morphTargetDictionary={nodes['Eye_Lid_L_Lower']['morphTargetDictionary']}
            morphTargetInfluences={nodes['Eye_Lid_L_Lower']['morphTargetInfluences']}
          />

          <skinnedMesh
            name="Eye_Lid_L_Upper"
            geometry={nodes['Eye_Lid_L_Upper']['geometry']}
            material={materials['Purple']}
            skeleton={nodes['Eye_Lid_L_Upper']['skeleton']}
            morphTargetDictionary={nodes['Eye_Lid_L_Upper']['morphTargetDictionary']}
            morphTargetInfluences={nodes['Eye_Lid_L_Upper']['morphTargetInfluences']}
          />

          <skinnedMesh
            name="Eye_Lid_R_Lower"
            geometry={nodes['Eye_Lid_R_Lower']['geometry']}
            material={materials['Purple']}
            skeleton={nodes['Eye_Lid_R_Lower']['skeleton']}
            morphTargetDictionary={nodes['Eye_Lid_R_Lower']['morphTargetDictionary']}
            morphTargetInfluences={nodes['Eye_Lid_R_Lower']['morphTargetInfluences']}
          />

          <skinnedMesh
            name="Eye_Lid_R_Upper"
            geometry={nodes['Eye_Lid_R_Upper']['geometry']}
            material={materials['Purple']}
            skeleton={nodes['Eye_Lid_R_Upper']['skeleton']}
            morphTargetDictionary={nodes['Eye_Lid_R_Upper']['morphTargetDictionary']}
            morphTargetInfluences={nodes['Eye_Lid_R_Upper']['morphTargetInfluences']}
          />

          <skinnedMesh
            name="Eye_R"
            geometry={nodes['Eye_R']['geometry']}
            material={materials['Material_#62.002']}
            skeleton={nodes['Eye_R']['skeleton']}
            morphTargetDictionary={nodes['Eye_R']['morphTargetDictionary']}
            morphTargetInfluences={nodes['Eye_R']['morphTargetInfluences']}
          />

          <skinnedMesh
            name="Eyebrow"
            geometry={nodes['Eyebrow']['geometry']}
            material={materials['Material #136.001']}
            skeleton={nodes['Eyebrow']['skeleton']}
            morphTargetDictionary={nodes['Eyebrow']['morphTargetDictionary']}
            morphTargetInfluences={nodes['Eyebrow']['morphTargetInfluences']}
          />

          <group name="Foxino_body">
            <skinnedMesh
              name="Foxino_body_1"
              geometry={nodes['Foxino_body_1']['geometry']}
              material={materials['Purple']}
              skeleton={nodes['Foxino_body_1']['skeleton']}
              morphTargetDictionary={nodes['Foxino_body_1']['morphTargetDictionary']}
              morphTargetInfluences={nodes['Foxino_body_1']['morphTargetInfluences']}
            />

            <skinnedMesh
              name="Foxino_body_2"
              geometry={nodes['Foxino_body_2']['geometry']}
              material={materials['Purple']}
              skeleton={nodes['Foxino_body_2']['skeleton']}
              morphTargetDictionary={nodes['Foxino_body_2']['morphTargetDictionary']}
              morphTargetInfluences={nodes['Foxino_body_2']['morphTargetInfluences']}
            />

            <skinnedMesh
              name="Foxino_body_3"
              geometry={nodes['Foxino_body_3']['geometry']}
              material={materials['Purple']}
              skeleton={nodes['Foxino_body_3']['skeleton']}
              morphTargetDictionary={nodes['Foxino_body_3']['morphTargetDictionary']}
              morphTargetInfluences={nodes['Foxino_body_3']['morphTargetInfluences']}
            />

            <skinnedMesh
              name="Foxino_body_4"
              geometry={nodes['Foxino_body_4']['geometry']}
              material={materials['Purple']}
              skeleton={nodes['Foxino_body_4']['skeleton']}
              morphTargetDictionary={nodes['Foxino_body_4']['morphTargetDictionary']}
              morphTargetInfluences={nodes['Foxino_body_4']['morphTargetInfluences']}
            />

            <skinnedMesh
              name="Foxino_body_5"
              geometry={nodes['Foxino_body_5']['geometry']}
              material={materials['Purple']}
              skeleton={nodes['Foxino_body_5']['skeleton']}
              morphTargetDictionary={nodes['Foxino_body_5']['morphTargetDictionary']}
              morphTargetInfluences={nodes['Foxino_body_5']['morphTargetInfluences']}
            />

            <skinnedMesh
              name="Foxino_body_6"
              geometry={nodes['Foxino_body_6']['geometry']}
              material={materials['Purple']}
              skeleton={nodes['Foxino_body_6']['skeleton']}
              morphTargetDictionary={nodes['Foxino_body_6']['morphTargetDictionary']}
              morphTargetInfluences={nodes['Foxino_body_6']['morphTargetInfluences']}
            />
          </group>

          <skinnedMesh
            name="teeth_lower"
            geometry={nodes['teeth_lower']['geometry']}
            material={materials['Material #167']}
            skeleton={nodes['teeth_lower']['skeleton']}
            morphTargetDictionary={nodes['teeth_lower']['morphTargetDictionary']}
            morphTargetInfluences={nodes['teeth_lower']['morphTargetInfluences']}
          />

          <skinnedMesh
            name="teeth_top"
            geometry={nodes['teeth_top']['geometry']}
            material={materials['Material #167']}
            skeleton={nodes['teeth_top']['skeleton']}
            morphTargetDictionary={nodes['teeth_top']['morphTargetDictionary']}
            morphTargetInfluences={nodes['teeth_top']['morphTargetInfluences']}
          />

          <skinnedMesh
            name="Tongue"
            geometry={nodes['Tongue']['geometry']}
            material={materials['Orange.001']}
            skeleton={nodes['Tongue']['skeleton']}
            morphTargetDictionary={nodes['Tongue']['morphTargetDictionary']}
            morphTargetInfluences={nodes['Tongue']['morphTargetInfluences']}
          />
        </group>
      </group>
    </group>
  );
};
