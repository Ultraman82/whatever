import { Router } from 'https://deno.land/x/oak/mod.ts';

const router = new Router();

router.get('/', async(ctx) => {
    ctx.render('index', {title: 'Index'})
});

export default router;