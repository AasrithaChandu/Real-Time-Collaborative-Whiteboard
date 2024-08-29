const canvas = document.getElementById('whiteboard');
        const ctx = canvas.getContext('2d');
        let drawing = false;
        let currentColor = 'black';
        let currentBrushSize = 2;
        let actions = [];
        let undoneActions = [];

        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Simulate a login check
            if (username === 'user' && password === 'password') {
                document.getElementById('login').style.display = 'none';
                document.getElementById('toolbar').style.display = 'flex';
                canvas.style.display = 'block';
            } else {
                alert('Invalid credentials!');
            }
        }

        function setColor(color) {
            currentColor = color;
        }

        function setBrushSize(size) {
            currentBrushSize = size;
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            actions = [];
            undoneActions = [];
        }

        canvas.addEventListener('mousedown', () => {
            drawing = true;
            undoneActions = [];
            actions.push({
                type: 'draw',
                color: currentColor,
                size: currentBrushSize,
                lines: []
            });
        });

        canvas.addEventListener('mouseup', () => drawing = false);
        canvas.addEventListener('mouseout', () => drawing = false);
        canvas.addEventListener('mousemove', draw);

        function draw(event) {
            if (!drawing) return;

            const x = event.clientX - canvas.offsetLeft;
            const y = event.clientY - canvas.offsetTop;
            ctx.lineWidth = currentBrushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentColor;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);

            actions[actions.length - 1].lines.push({
                x,
                y
            });
        }

        function undo() {
            if (actions.length > 0) {
                undoneActions.push(actions.pop());
                redraw();
            }
        }

        function redo() {
            if (undoneActions.length > 0) {
                actions.push(undoneActions.pop());
                redraw();
            }
        }

        function redraw() {
            clearCanvas();
            for (let action of actions) {
                if (action.type === 'draw') {
                    ctx.lineWidth = action.size;
                    ctx.strokeStyle = action.color;
                    ctx.beginPath();
                    for (let i = 0; i < action.lines.length; i++) {
                        const {
                            x,
                            y
                        } = action.lines[i];
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                } else if (action.type === 'image') {
                    ctx.drawImage(action.image, action.x, action.y, action.width, action.height);
                }
            }
        }

        function saveAsImage() {
            const link = document.createElement('a');
            link.download = 'whiteboard.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }

        function toggleChat() {
            const chat = document.getElementById('chat');
            chat.style.display = chat.style.display === 'none' ? 'block' : 'none';
        }

        function sendMessage(event) {
            if (event.key === 'Enter') {
                const message = document.getElementById('chatInput').value;
                const chatMessages = document.getElementById('chatMessages');
                const newMessage = document.createElement('div');
                newMessage.textContent = message;
                chatMessages.appendChild(newMessage);
                document.getElementById('chatInput').value = '';

                // Simulate receiving a response from another user
                setTimeout(() => {
                    const reply = document.createElement('div');
                    reply.textContent = "Other user: " + message;
                    chatMessages.appendChild(reply);
                }, 1000);
            }
        }

        // Handle image upload
        function handleImageUpload(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const x = (canvas.width - img.width) / 2;
                    const y = (canvas.height - img.height) / 2;
                    ctx.drawImage(img, x, y);
                    actions.push({
                        type: 'image',
                        image: img,
                        x: x,
                        y: y,
                        width: img.width,
                        height: img.height
                    });
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }

        // Simulated real-time collaboration
        function simulateRealTime() {
            setInterval(() => {
                if (Math.random() > 0.8) {
                    // Simulate another user drawing
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    ctx.lineWidth = Math.random() * 5;
                    ctx.strokeStyle = ['red', 'blue', 'green'][Math.floor(Math.random() * 3)];
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + Math.random() * 50, y + Math.random() * 50);
                    ctx.stroke();
                }
            }, 1000);
        }

        simulateRealTime();
