import { Box, Grid, Paper, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Sound, { SoundValidationError } from 'classes/Sound';
import SoundAdmin from 'Components/SoundAdmin';
import SoundInfo from 'Components/SoundInfo';
import SoundUpload from 'Components/SoundUpload';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authGetViewer } from 'recoil/auth';
import { GalaError } from 'requests/GalaController';
import Swal from 'sweetalert2';
import { ContentGridSC, DetailCardSC, PageHeaderSC } from './Sounds.style';

// used to prevent Swal popups when not on the page
let clientOnPage = true;

export default function Sounds() {
  const vc = useRecoilValue(authGetViewer);
  const theme = useTheme();
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [allSounds, setAllSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(100);

  /**
   * Gets the latest sound data from backend
   */
  const updateSounds = useCallback(async () => {
    if (!clientOnPage) return;
    setLoading(true);

    let sounds: Sound[] = [];
    try {
      sounds = await Sound.genAll();
    } catch (err: any) {
      if (!clientOnPage) return;

      const errorText = err.response
        ? err.response.data.msg || `HTTP Code ${err.response.status}`
        : `Cant reach ${err.config.url}`;

      Swal.fire({
        title: 'Error with the server: GET /sounds',
        text: errorText,
        icon: 'error',
      });
    }

    setAllSounds(sounds);
    setLoading(false);
  }, []);

  useEffect(() => {
    // called on mount
    clientOnPage = true;
    updateSounds();

    // called on unmount
    return () => {
      clientOnPage = false;
      Swal.close();
    };
  }, [updateSounds]);

  const columns: GridColDef<any, Sound>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 106,
      hideable: false,
    },
    {
      field: 'occurrences',
      headerName: '# of plays',
      width: 130,
      hideable: false,
    },
    {
      field: 'ownerName',
      headerName: 'Owner',
      width: 109,
      hideable: false,
    },
  ];

  const onSoundSubmit = async () => {
    if (!selectedSound) {
      throw Error('Sound update submitted with no sound selected');
    }
    try {
      await selectedSound.genUpdate(vc?.isAdmin);
    } catch (err: any) {
      if (err instanceof SoundValidationError) {
        await Swal.fire({
          title: 'Unable to Validate Input',
          html: err.message,
          icon: 'error',
          confirmButtonColor: theme.palette.primary.main,
        });
      } else if (err instanceof GalaError) {
        await Swal.fire({
          title: 'Unable to Update Sound',
          html: err.message,
          icon: 'error',
          confirmButtonColor: theme.palette.primary.main,
        });
      } else {
        throw err;
      }
    }
  };

  return (
    <>
      <PageHeaderSC>Sounds</PageHeaderSC>
      <ContentGridSC container spacing={2}>
        <Grid item>
          <Box sx={{ height: 650, width: 'max-content' }} component={Paper}>
            <DataGrid
              rows={allSounds}
              columns={columns}
              onRowClick={(value) => {
                setSelectedSound(value.row);
              }}
              loading={loading}
              pageSize={pageCount}
              onPageSizeChange={setPageCount}
              rowsPerPageOptions={[10, 25, 50, 100]}
              hideFooterSelectedRowCount
            />
          </Box>
        </Grid>

        {selectedSound && (
          <>
            <Grid item>
              <DetailCardSC>
                <SoundInfo sound={selectedSound} />
              </DetailCardSC>
            </Grid>
            {vc?.isAdmin && (
              <Grid item>
                <DetailCardSC>
                  <SoundAdmin
                    sound={selectedSound}
                    onSubmit={onSoundSubmit}
                    maxVolume={Sound.MAX_SOUND_VOLUME}
                  />
                </DetailCardSC>
              </Grid>
            )}
          </>
        )}
        {vc && (
          <Grid item>
            <SoundUpload viewer={vc} themeSwal={theme} />
          </Grid>
        )}
      </ContentGridSC>
    </>
  );
}
