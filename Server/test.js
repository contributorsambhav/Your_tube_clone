import {translate} from '@vitalets/google-translate-api';

translate('Ik spreek Engels', { to: 'en' }).then(res => {
    console.log(res.text); // 'I speak English'
}).catch(err => {
    console.error(err);
});
