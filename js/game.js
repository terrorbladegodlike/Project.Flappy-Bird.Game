export default class Game {
  constructor(config, background, pipes, bird, message, score, canvas) {
    this.config = config;
    this.background = background;
    this.pipes = pipes;
    this.bird = bird;
    this.frames = 0;
    this.state = this.config.state;
    this.message = message;
    this.score = score;
    this.canvasNode = canvas.canvas;
    this.loop = this.loop.bind(this);
    this.control();
  }

  //Обновляем сущьности
  update() {
    this.bird.update(this.frames, this.state);
    this.pipes.update(this.frames, this.state, this.score);
    this.background.update(this.state);
  }

  //Отрисовываем сущьности
  draw() {
    this.background.draw('bg');
    this.pipes.draw();
    this.background.draw('fg');
    this.bird.draw();
    this.message.draw(this.state);
    this.score.draw(this.state);
  }

  control() {
    const resetAll = () => {
      this.pipes.reset();
      this.bird.reset();
      this.score.reset();
      this.state.current = this.state.ready;
    };

    const eventHandle = (event) => {
      if (this.state.current === this.state.ready) {
        this.state.current = this.state.game;
      } else if (this.state.current === this.state.game) {
        if (this.bird.y - this.bird.size <= 0) return;
        this.bird.flipMove();
      } else if (this.state.current === this.state.gameOver) {
        let btnRect = this.canvasNode.getBoundingClientRect();
        let x = event.clientX - btnRect.left;
        let y = event.clientY - btnRect.top;

        if (event.type === 'click') {
          if (x >= this.config.startBtn.x && x <= this.config.startBtn.x + this.config.startBtn.width && y >= this.config.startBtn.y && y <= this.config.startBtn.y + this.config.startBtn.height) {
            resetAll();
          }
        } else if (event.type === 'keydown') {
          resetAll();
        }
      }
    };

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        eventHandle(event);
      }
    });
    this.canvasNode.addEventListener('click', (event) => {
      eventHandle(event);
    });
  }

  loop() {
    this.update();
    this.draw();
    this.frames++;

    requestAnimationFrame(this.loop);
  }
}
