import { Link } from 'react-router-dom';
import { ContentSC } from './Home.style';

export default function Home() {
  return (
    <ContentSC>
      <h1>Home</h1>
      <p>
        Welcome to the official T&P site. This is where you can preform a few
        actions such as looking at play and game data, make bot/website
        suggestions, and upload your own sound clips!
      </p>
      <p>
        Please report bugs on the project's <Link to="/suggest">Github</Link>.
      </p>
      <iframe
        title="serverOverview"
        src="https://discord.com/widget?id=310965178902773770&theme=dark"
        width="350"
        height="500"
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      ></iframe>
    </ContentSC>
  );
}
