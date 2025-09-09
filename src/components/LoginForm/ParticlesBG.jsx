import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import ParticlesConfig from "../../configs/particles-config";

const ParticlesBG = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async () => {}, []);

    return (
        <div id="particle-background">
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={ParticlesConfig}
                height="99vh"
            />
        </div>
    );
};

export default ParticlesBG;
