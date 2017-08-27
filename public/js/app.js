import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import ajaxUpvote from './modules/upvote';

const upvoteForms = $$('form.upvote');
upvoteForms.on('submit', ajaxUpvote);