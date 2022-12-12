function getShader(_renderer) {
	const vert = `
		attribute vec3 aPosition;
		attribute vec2 aTexCoord;

		varying vec2 vTexCoord;

		void main() {
			vTexCoord = aTexCoord;

			vec4 positionVec4 = vec4(aPosition, 1.0);
			positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

			gl_Position = positionVec4;
		}
	`;

	const frag = `
		precision highp float;

		varying vec2 vTexCoord;

		uniform vec3 metaballs[${N_balls}];
        uniform vec3 wave_metaballs[${N_wave_balls}];

		const float WIDTH = ${getWindowWidth()}.0;
		const float HEIGHT = ${getWindowHeight()}.0;



		void main() {
			float x = vTexCoord.x * WIDTH;
			float y = vTexCoord.y * HEIGHT;
			float v = 0.0;

			for (int i = 0; i < ${N_balls}; i++) {
				vec3 ball = metaballs[i];
				float dx = ball.x - x;
				float dy = ball.y - y;
				float r = ball.z;
				v += r * r / (dx * dx + dy * dy);
			}

            for (int i = 0; i < ${N_wave_balls}; i++) {
				vec3 wave_ball = wave_metaballs[i];
				float dx = wave_ball.x - x;
				float dy = wave_ball.y - y;
				float r = wave_ball.z;
				v += r * r / (dx * dx + dy * dy);
			}

			if (0.9 < v && v < 1.1) {
				float a = (v - 0.9) * 4.;
				gl_FragColor = vec4(vec3(255, 255, 255), 1.0);
			} else gl_FragColor = vec4(0, 0, 0, 1.0);
		}
	`;
	
	return new p5.Shader(_renderer, vert, frag);
}