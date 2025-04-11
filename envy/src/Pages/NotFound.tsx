import { redirect } from 'react-router-dom';
import notFoundPicture from 'assets/404_image.png';
import { ContentSC } from './NotFound.style';

export const NOT_FOUND_PATH = 'not_found';

export default function NotFound() {
  return (
    <ContentSC>
      <h1>404 Not Found</h1>
      <img src={notFoundPicture} alt="404 not found meme" />
    </ContentSC>
  );
}

export function NotFoundRedirect() {
  redirect(`/${NOT_FOUND_PATH}`, 404);
  return <></>;
}
