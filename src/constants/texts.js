const CANVAS1 = `
  Our canvases come in 4 sizes, with a 4cm deep frame (3cm on 30cm x 30cm), that allows your art to beautifully 
  bleed around the sides.
`

const CANVAS2 = `
  240dpi eco-solvent printing on 310gsm Eclipse Premium Satin Solvent Canvas provides the finest and most durable 
  finish possible.
`

const CANVAS3 = `
  Hand-cut and stretched canvases ensure your art piece is accurately and tightly stretched to perfection.
`

const CANVAS4 = `
   FSC certified sustainable Poplar timber, which is kiln dried and laminated, ensuring that it’s incredibly strong, 
   durable and resistant to warping  and bending. 
`

export const HOME_PAGE_TEXTS = {
  canvas1: CANVAS1,
  canvas2: CANVAS2,
  canvas3: CANVAS3,
  canvas4: CANVAS4,
}
const DONE_PAYMENT_SUCCESSFULLY = `Done payment successfully.`
const FAILED_PAYMENT_SUCCESSFULLY = `Failed payment successfully.`

export const STRIPE_CHECKOUT = {
  donePaymentSuccess: DONE_PAYMENT_SUCCESSFULLY,
  failedPaymentSuccess: FAILED_PAYMENT_SUCCESSFULLY
}

export const sizesArr = [
    {letter: 'S', size: '30cm x 30cm', price: 390},
    {letter: 'M', size: '60cm x 60cm', price: 690},
    {letter: 'L', size: '90cm x 90cm', price: 990},
    // {letter: 'XL', size:'', price: 1490}
]
export const sizesOptions = [
  {value: 'S', label: 'S - 30cm x 30cm'},
  {value: 'M', label: 'M - 60cm x 60cm'},
  {value: 'L', label: 'L - 90cm x 90cm'},
  // {value:'XL', label:'XL-48'}
]
export const policyItems = [
    {
        heading: 'PRIVACY POLICY',
        main: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate.'
    },
    {
        heading: 'REFUND POLICY',
        main: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate.'
    },
    {
        heading: 'SHIPPING POLICY',
        main: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate.'
    },
    {
        heading: 'TERMS OF SERVICE',
        main: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate. ' +
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid cumque distinctio doloremque ea eaque' +
            ' esse facere fuga itaque nobis pariatur placeat quas quidem quos, sed totam ullam vitae voluptas voluptate.'
    },
]

export const socialMedias = [
    {name:'instagram', link:'https://www.instagram.com/artyst.ai/'},
    {name:'twitter', link:'https://twitter.com/Artyst_ai'},
    {name:'facebook', link:'https://www.facebook.com/Artystai'},
    {name:'linkedin', link:'https://www.linkedin.com/company/artyst-ai/'},
]
