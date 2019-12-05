A rendering engine for WebGL written in typescript.

The goal of this repo is to create a fully functional, flexible, and composable WebGL playground for writing and manipulating shaders.
It will allow for the user to pick from a selection of primitives for quick shape generation in 2d or 3d, or to load in
custom shaders written in GLSL to test in isolation without the need to write boilerplate code every time.

Browser must support WebGL 2.0 or higher.

To run this application, from the command line run the following commands:

1. `$ git clone https://github.com/johnnyrayalt/webgl-typescript.git && cd webgl-typescript`
2. `$ npm install -g parcel`
3. `$ npm install`
4. `$ npm run build`
5. `$ npm run start`
6. navigate to `localhost:1234` to view application
