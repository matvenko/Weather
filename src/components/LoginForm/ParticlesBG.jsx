import React from "react";
import { useCallback } from "react";

import ParticlesConfig from "../../configs/particles-config";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBG = () => {
  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <div id="particle-background">
      <Particles
        id="tsparticles"
        particlesLoaded="particlesLoaded"
        init={particlesInit}
        loaded={particlesLoaded}
        options={ParticlesConfig}
        height="99vh"
      ></Particles>
    </div>
  );
};

export default ParticlesBG;
