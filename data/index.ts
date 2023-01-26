export interface ProductData {
    name: string
    description: string
    size: {
        width: number
        height: number
        depth: number
    }
    weight: number
    price: number
    included: string[]
    shipping: boolean
    pickup: boolean,
    images: string[]
}


const data: ProductData[] = [{
    "name": "Apple iPhone 12 Pro",
    "description": "Das Apple iPhone 12 Pro ist ein hochmodernes Smartphone mit einem 6,1-Zoll-Super-Retina XDR-Display, der A14 Bionic Chip, einer Triple-Kamera-System mit 12 MP Pro Kamera, einem Ceramic Shield Frontcover und einer 5G-Unterstützung. Es ist in den Farben Gold, Graphit, Silber und Pacifikblau erhältlich.",
    "size": {
        "height": 160,
        "width": 78,
        "depth": 7.65
    },
    "weight": 238,
    "included": [
        "Apple iPhone 12 Pro",
        "Lightning auf USB-C Kabel",
        "USB-C Power Adapter"
    ],
    "shipping": true,
    "pickup": false,
    "price": 1099,
    "images": [
        "1.jpg",
        "2.jpg",
        "3.jpg",
    ]
},
    {
        "name": "Ficus benjamina",
        "description": "Die Ficus benjamina, auch Weeping Fig genannt, ist ein immergrüner Baum oder Strauch mit tiefgrünen, gefiederten Blättern. Sie kann bis zu 10 Meter hoch werden und ist eine beliebte Zimmerpflanze. Der Standort sollte hell, aber nicht direkt in der prallen Sonne sein und regelmäßig gegossen werden.",
        "size": {
            "height": 150,
            "width": 60,
            "depth": 40
        },
        "weight": 15,
        "included": [
            "Ficus benjamina",
            "Pflanzerde",
            "Dünger"
        ],
        "shipping": false,
        "pickup": false,
        "price": 29.99,
        "images": [
            "4.jpg",
            "5.jpg",
            "6.jpg",
            "7.jpg",
        ]
    },
    {
        "name": "Art Deco Tischlampe",
        "description": "Die Tischlampe im Art Deco Stil besteht aus Messing und hat eine opulente Formensprache. Sie ist ein echter Hingucker in jedem Wohnzimmer und passt perfekt zu einer Einrichtung im Art Deco oder Jugendstil. Die Lampe hat eine E27 Fassung und ist mit einem Textilschirm ausgestattet.",
        "size": {
            "height": 70,
            "width": 30,
            "depth": 30
        },
        "weight": 2.5,
        "included": [
            "Art Deco Tischlampe",
            "Textilschirm"
        ],
        "shipping": true,
        "pickup": true,
        "price": 99.99,
        "images": [
            "8.png",
            "9.png",
            "10.png",
            "11.png",
        ]
    },
    {
        "name": "Damen Citybike",
        "description": "Guten Tag, das Fahrrad ist in sehr gutem Zustand. Meine Frau ist damit ein Jahr lang gefahren. Wir ziehen leider um und benötigen es deshalb nicht mehr.",
        size: {
            "height": 100,
            "width": 60,
            "depth": 20
        },
        "weight": 15,
        "included": [
            "Damen Citybike",
            "Kettenschloss"
        ],
        "shipping": false,
        "pickup": true,
        "price": 199,
        "images": [
            "12.jpg",
            "13.jpg",
            "14.jpg",
            "15.jpg",
            "16.jpg",
        ]
    },
    {
        "name": "3 kleine Frühlingswichtel",
        "description": "Hallo, ich verkaufe meine 3 kleinen Frühlingswichtel. Sie standen bei mir zwei Jahre im Garten, sind aber noch in gutem Zustand. Jeder ist 23 cm groß.",
        "size": {
            "height": 23,
            "width": 8,
            "depth": 7
        },
        "weight": 0.5,
        "included": [
            "3 kleine Frühlingswichtel"
        ],
        "shipping": true,
        "pickup": false,
        "price": 29.99,
        "images": [
            "17.jpg"
        ]
    },
    {
        "name": "Nintendo DS + Sonic Rush",
        "description": "Hallo, ich verkaufe meinen Nintendo DS mit dem Spiel Sonic Rush. Der Nintendo DS ist in einem guten Zustand und funktioniert einwandfrei. Das Spiel ist ebenfalls in einem guten Zustand und funktioniert einwandfrei. Beide sind in der Originalverpackung.",
        "size": {
            "height": 20,
            "width": 10,
            "depth": 5
        },
        "weight": 0.3,
        "included": [
            "Nintendo DS",
            "Sonic Rush"
        ],
        "shipping": true,
        "pickup": false,
        "price": 49.99,
        "images": [
            "18.jpg",
            "19.jpg",
            "20.jpg",
        ]
    },
    {
        "name": "Underwood Schreibmaschine",
        "description": "Hallo, ich verkaufe meine alte Underwood Schreibmaschine. Sie ist in einem guten Zustand und funktioniert einwandfrei. Die Schreibmaschine ist in der Originalverpackung. Diese Maschine wurde 1960 hergestellt und wurde noch nicht so oft benutzt. Es ist noch möglich mit ihr zu schreiben.",
        "size": {
            "height": 30,
            "width": 40,
            "depth": 20
        },
        "weight": 5,
        "included": [
            "Underwood Schreibmaschine"
        ],
        "shipping": true,
        "pickup": false,
        price: 99.99,
        "images": [
            "21.jpg",
            "22.jpg",
        ]
    },
    {
        "name": "Schreibtisch inkl Stuhl",
        "description": "Guten Tag, ich verkaufe meinen Schreibtisch mit 2 Schubladen pro Seite und einem Bürostuhl. Der Stuhl hat die Farbe Blau.",
        "size": {
            "height": 75,
            "width": 120,
            "depth": 60
        },
        "weight": 30,
        "included": [
            "Schreibtisch",
            "Stuhl"
        ],
        "shipping": true,
        "pickup": true,
        "price": 199,
        "images": [
            "23.jpg",
        ]
    },
    {
        "name": "Holzuhr Antik France",
        "description": "Hallo, ich biete eine meiner vielen antiken Uhren zum Verkauf. Die Uhr ist von der Marke France, die auch einen lauten Schlag hat. Ich besitze sie schon seit 30 Jahren, davor hatte die Uhr auch schon andere Besitzer. Bei Interesse kann ich Ihnen genauere Bilder schicken. Bei Fragen einfach per Nachricht melden oder auch direkt anrufen.",
        "size": {
            "height": 40,
            "width": 40,
            "depth": 10
        },
        "weight": 5,
        "included": [
            "Holzuhr Antik France mit Schlagwerk"
        ],
        "shipping": true,
        "pickup": false,
        "price": 99.99,
        "images": [
            "24.jpg",
            "25.jpg",
            "26.jpg",
            "27.jpg",
        ]
    }
]

export default data