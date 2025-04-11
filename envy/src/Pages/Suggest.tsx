import { SiGithub } from 'react-icons/si';
import { ContentSC, GithubButtonSC } from './Suggest.style';

export default function Suggest() {
  return (
    <ContentSC>
      <h1>Suggestion Page</h1>
      {/* GitHub button */}
      <a
        style={{ textDecoration: 'none' }}
        href="https://github.com/BenPVandenberg/TaP-Discord-Bot/issues"
      >
        <GithubButtonSC>
          <SiGithub style={{ marginRight: '10px' }} size={36} />{' '}
          Issue/Suggestion Submission
        </GithubButtonSC>
      </a>
    </ContentSC>
  );
}
