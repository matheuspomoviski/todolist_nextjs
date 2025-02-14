import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { TaskProvider } from "../utils/ContextApi";

export default function App({ Component, pageProps }) {
    return (
        <TaskProvider>
            <Component {...pageProps} />;
        </TaskProvider>
    );
}
