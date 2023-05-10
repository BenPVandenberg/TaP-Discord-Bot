import { Box, Paper, ToggleButton } from '@mui/material';
import User from 'classes/User';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authGetViewer } from 'recoil/auth';
import { GameLog, TimeLog, VoiceLog } from 'requests/GalaResponseTypes';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  ContentSC,
  TextFieldSC,
  TitleSC,
  ToggleButtonGroupSC,
} from './Data.style';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// used to prevent Swal popups when not on the page
let clientOnPage = true;

type TableType = 'game' | 'voice';

const gameLogCols: GridColDef<any, GameLog>[] = [
  {
    field: 'username',
    headerName: 'Username',
    width: 120,
    hideable: false,
  },
  {
    field: 'game',
    headerName: 'Game',
    width: 300,
    hideable: false,
  },
  {
    field: 'start',
    headerName: 'Start',
    width: 175,
    hideable: false,
  },
  {
    field: 'end',
    headerName: 'End',
    width: 175,
    hideable: false,
  },
];

const voiceLogCols: GridColDef[] = [
  {
    field: 'username',
    headerName: 'Username',
    width: 120,
    hideable: false,
  },
  {
    field: 'channel',
    headerName: 'Channel',
    width: 300,
    hideable: false,
  },
  {
    field: 'start',
    headerName: 'Start',
    width: 175,
    hideable: false,
  },
  {
    field: 'end',
    headerName: 'End',
    width: 175,
    hideable: false,
  },
];

export default function Data() {
  const vc = useRecoilValue(authGetViewer);
  let [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type') === 'voice' ? 'voice' : 'game';

  const [tableView, setTableView] = useState<TableType>(type);
  const [userId, setUserId] = useState<string>(
    searchParams.get('user') ?? vc?.username ?? ''
  );
  const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);
  const [pageCount, setPageCount] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * This function will update the data on the visible table
   * @param user User's ID or username
   */
  const fetchLogs = async (user: string) => {
    // verify we have a string
    if (!user) return;
    if (!clientOnPage) return;
    let errorOccurred = false;

    setSearchParams({
      type: tableView,
      user: user,
    });

    // learn if we have a username or id
    const inputType: 'ID' | 'USERNAME' =
      user === '' || isNaN(Number(user)) ? 'USERNAME' : 'ID';

    // show loading
    Swal.fire({
      title: 'Loading logs from server',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });
    Swal.showLoading();

    // run queries for game and voice data
    let gameResponse: GameLog[] = [];
    let voiceResponse: VoiceLog[] = [];
    try {
      const userEnt = await User.gen(inputType, user);

      [gameResponse, voiceResponse] = await Promise.all([
        userEnt.genGameLogs(),
        userEnt.genVoiceLogs(),
      ]);
    } catch (err: any) {
      errorOccurred = true;
      if (err instanceof Error) {
        // check if user still on page (may have left due to async)
        if (!clientOnPage) return;
        await Swal.fire({
          title: `Error getting logs`,
          text: err.message,
          icon: 'error',
        });
      }
    }

    const convertDataForDisplay = (log: TimeLog) => {
      const start = new Date(log.start);
      if (start) {
        log.start = start.toLocaleString();
      }
      if (log.end) {
        const end = new Date(log.end);
        if (end) {
          log.end = end.toLocaleString();
        }
      }
    };

    // convert Start and End to date objects
    gameResponse.forEach(convertDataForDisplay);
    voiceResponse.forEach(convertDataForDisplay);

    setGameLogs(gameResponse);
    setVoiceLogs(voiceResponse);

    // stop loading
    if (!errorOccurred) Swal.close();

    // if no data on user
    if (!gameResponse.length && !voiceResponse.length && !errorOccurred) {
      await Swal.fire({
        title: `No results for this ${inputType}`,
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    setSearchParams({
      type: tableView,
      user: userId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSearchParams, tableView]);

  useEffect(() => {
    if (!userId && vc) {
      setUserId(vc.username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vc]);

  useEffect(() => {
    // called on mount
    clientOnPage = true;
    fetchLogs(userId);

    // called on unmount
    return () => {
      clientOnPage = false;
      Swal.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContentSC>
      <TitleSC>Data Lookup</TitleSC>
      <TextFieldSC
        label="User ID or Username"
        fullWidth
        variant="outlined"
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') fetchLogs(userId);
        }}
      />

      <ToggleButtonGroupSC
        value={tableView}
        color="primary"
        exclusive
        onChange={(_event, newTableView) => {
          setTableView(newTableView);
        }}
      >
        <ToggleButton value="game">Game</ToggleButton>
        <ToggleButton value="voice">Voice</ToggleButton>
      </ToggleButtonGroupSC>

      <Box sx={{ height: 620, width: 'max' }} component={Paper}>
        {tableView === 'game' ? (
          <DataGrid
            rows={gameLogs}
            columns={gameLogCols}
            loading={loading}
            pageSize={pageCount}
            onPageSizeChange={setPageCount}
            rowsPerPageOptions={[10, 25, 50, 100]}
            hideFooterSelectedRowCount
          />
        ) : (
          <DataGrid
            rows={voiceLogs}
            columns={voiceLogCols}
            loading={loading}
            pageSize={pageCount}
            onPageSizeChange={setPageCount}
            rowsPerPageOptions={[10, 25, 50, 100]}
            hideFooterSelectedRowCount
          />
        )}
      </Box>
    </ContentSC>
  );
}
