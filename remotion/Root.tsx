import { Composition } from "remotion";
import { OperationsScene } from "./compositions/OperationsScene";
import { ReportingScene } from "./compositions/ReportingScene";
import { ResearchScene } from "./compositions/ResearchScene";

const FPS = 30;
const DURATION_SECONDS = 6;
const WIDTH = 1600;
const HEIGHT = 900;

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="OperationsScene"
                component={OperationsScene}
                durationInFrames={FPS * DURATION_SECONDS}
                fps={FPS}
                width={WIDTH}
                height={HEIGHT}
            />
            <Composition
                id="ReportingScene"
                component={ReportingScene}
                durationInFrames={FPS * DURATION_SECONDS}
                fps={FPS}
                width={WIDTH}
                height={HEIGHT}
            />
            <Composition
                id="ResearchScene"
                component={ResearchScene}
                durationInFrames={FPS * DURATION_SECONDS}
                fps={FPS}
                width={WIDTH}
                height={HEIGHT}
            />
        </>
    );
};
