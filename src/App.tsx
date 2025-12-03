import { type FC, useRef, useState } from 'react';
import { useAudio } from 'react-use';
import { CameraControls, ContactShadows } from '@react-three/drei';
import { Canvas, type Vector3 } from '@react-three/fiber';

import { Model } from '@app/components';
import { messageToPlay } from '@app/constants';

const App: FC = () => {
  const cameraControls = useRef<CameraControls>(null);

  const [isLoading, setIsLoading] = useState(true);

  const audioUrl =
    messageToPlay?.audioUrl ?? (messageToPlay?.audio ? `data:audio/mp3;base64,${messageToPlay?.audio}` : '');

  const [audioElement, targetAudioSoundState, targetAudioControls] = useAudio({
    src: audioUrl || '',
  });

  const setupCamera = () => {
    cameraControls.current?.setLookAt(0.2, 1.2, 3.2, 0, 0.8, 0, true);
  };

  const handleModelRendered = () => {
    setIsLoading(false);
    setupCamera();
  };

  const play = () => {
    if (targetAudioSoundState.duration) {
      targetAudioControls.play();
    }
  };

  return (
    <div className="h-screen w-screen">
      {audioElement}

      <button className="absolute left-4 top-4 z-10 rounded bg-gray-900 px-4 py-2 text-gray-100" onClick={play}>
        Play audio
      </button>

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <p className="text-center font-bold">Loading model...</p>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 4, 5], fov: 40 }} className="size-full">
        <ambientLight intensity={1} />

        <directionalLight position={[1, 1, 3]} intensity={1} />

        <CameraControls
          ref={cameraControls}
          enabled
          mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
          touches={{ one: 0, two: 0, three: 0 }}
        />

        <ContactShadows opacity={0.7} />

        <Model message={messageToPlay} currentAudioTime={targetAudioSoundState.time} onRender={handleModelRendered} />
      </Canvas>
    </div>
  );
};

export default App;
