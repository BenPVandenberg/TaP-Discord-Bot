import Home from 'Pages/Home';
import { FaHome, FaMusic } from 'react-icons/fa';
import { TPath } from 'constants/Types';
import Sounds from 'Pages/Sounds';
import Data from 'Pages/Data';
import { ImDatabase } from 'react-icons/im';
import Suggest from 'Pages/Suggest';
import { IoSend } from 'react-icons/io5';
import NotFound, { NotFoundRedirect, NOT_FOUND_PATH } from 'Pages/NotFound';
import { Route, Routes } from 'react-router-dom';
import Login from 'Pages/Login';
import { NavEntryType } from 'Components/NavBar';

export const ROUTES: TPath[] = [
  {
    to: '/',
    element: <Home />,
    navEntry: {
      label: 'Home',
      icon: FaHome,
    },
    subPaths: [
      {
        to: 'sounds',
        element: <Sounds />,
        navEntry: {
          label: 'Sounds',
          icon: FaMusic,
        },
        subPaths: null,
      },
      {
        to: 'data',
        element: <Data />,
        navEntry: {
          label: 'Data',
          icon: ImDatabase,
        },
        subPaths: null,
      },
      {
        to: 'suggest',
        element: <Suggest />,
        navEntry: {
          label: 'Suggest',
          icon: IoSend,
        },
        subPaths: null,
      },
      {
        to: 'login',
        element: <Login />,
        navEntry: null,
        subPaths: null,
      },
      {
        to: `${NOT_FOUND_PATH}`,
        element: <NotFound />,
        navEntry: null,
        subPaths: null,
      },
      {
        to: '*',
        element: <NotFoundRedirect />,
        navEntry: null,
        subPaths: null,
      },
    ],
  },
];

export function getRoutes() {
  return <Routes>{getRoutesHelper(ROUTES)}</Routes>;
}

function getRoutesHelper(routes: TPath[]) {
  return routes.map((route) => {
    if (route.subPaths) {
      return (
        <Route path={route.to.toString()} key={route.to.toString()}>
          {route.element && <Route index element={route.element} />}
          {getRoutesHelper(route.subPaths)}
        </Route>
      );
    }

    return (
      <Route
        path={route.to.toString()}
        element={route.element}
        key={route.to.toString()}
      />
    );
  });
}

export function getNavEntries() {
  return flatten(ROUTES).reduce<NavEntryType[]>((result, route) => {
    if (route.navEntry) {
      result.push({
        label: route.navEntry.label,
        href: route.to,
        icon: route.navEntry.icon,
      });
    }
    return result;
  }, []);
}

function flatten(entries: TPath[], base: string = '', rtn: TPath[] = []) {
  entries.forEach((entry) => {
    rtn.push({ ...entry, to: base + entry.to, subPaths: null });
    if (entry.subPaths) {
      flatten(entry.subPaths, base + entry.to, rtn);
    }
  });
  return rtn;
}
