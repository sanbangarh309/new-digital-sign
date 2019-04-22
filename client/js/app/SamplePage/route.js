import auth from 'src/auth';
import Loadable from '../components/LoadableCircle';

/* This is normal component */
// import route from './SamplePage';

/* This is asynchronous component */
const route = Loadable({
    loader: () => import('./SamplePage'),
});

// Verify the permission for viewing this page
export default auth.permission.verify.basic(route);
