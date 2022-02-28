import { createApp } from 'vue'
import App from './App.vue';

import store from "./store/"

// import 'primevue/resources/themes/lara-dark-purple/theme.css';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';

// import 'primevue/resources/themes/md-dark-indigo/theme.css';
// import 'primevue/resources/themes/md-dark-deeppurple/theme.css';

// import 'primevue/resources/themes/mdc-dark-indigo/theme.css';
// import 'primevue/resources/themes/mdc-dark-deeppurple/theme.css';

// import 'primevue/resources/themes/lara-dark-indigo/theme.css';
// import 'primevue/resources/themes/lara-dark-teal/theme.css';




import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import './styles/styles.scss'

import 'primeflex/primeflex.css';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Carousel from 'primevue/carousel';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Rating from 'primevue/rating';
import ProgressSpinner from 'primevue/progressspinner';

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.use(Carousel);
app.use(store);


// globally (in your main .js file)
app.component('InputText', InputText);
app.component('Button', Button);
app.component('Toast', Toast);
app.component('Carousel', Carousel);
app.component('Checkbox', Checkbox);
app.component('Divider', Divider);
app.component("Accordion", Accordion);
app.component("AccordionTab", AccordionTab);
app.component("Rating", Rating);
app.component("ProgressSpinner", ProgressSpinner);

app.mount('#app')
