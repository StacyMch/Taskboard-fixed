    //создаем модель таскборда
    let data = localStorage.getItem('boards');
    console.log(data)

    //если нет сохраненного, то выдаем стартовый объект
    if (data == null) {
        //перезаписываем data
        data = {
            "boards":[
                {
                    "title":"inordic",
                    "columns":[
                        {
                            "title":"",
                            "cards":[

                            ]
                        }
                    ]
                }
            ]
        };
    } else {
        data = JSON.parse(data);
    }

    //список фонов для JSON-модели
    let backgrounds = [

                'https://stacymch.github.io/wallpapers/img/castle.jpg',
                'https://stacymch.github.io/wallpapers/img/forest.jpg',
                'https://stacymch.github.io/wallpapers/img/hall.jpg',
                'https://stacymch.github.io/wallpapers/img/house.jpg',
                'https://stacymch.github.io/wallpapers/img/portal.jpg',
                'https://stacymch.github.io/wallpapers/img/river.jpg',
                'https://stacymch.github.io/wallpapers/img/tree.jpg',
                'https://stacymch.github.io/wallpapers/img/waterfall.jpg',

                'https://stacymch.github.io/wallpapers/img/nature1.jpg',
                'https://stacymch.github.io/wallpapers/img/nature2.jpg',
                'https://stacymch.github.io/wallpapers/img/nature3.jpg',
                'https://stacymch.github.io/wallpapers/img/nature4.jpg',
                'https://stacymch.github.io/wallpapers/img/nature5.jpg',
                'https://stacymch.github.io/wallpapers/img/nature6.jpg',
                'https://stacymch.github.io/wallpapers/img/nature7.jpg',
                'https://stacymch.github.io/wallpapers/img/nature8.jpg',

                'https://stacymch.github.io/wallpapers/img/anime2.jpg',
                'https://stacymch.github.io/wallpapers/img/anime3.jpg',
                'https://stacymch.github.io/wallpapers/img/anime4.jpg',
                'https://stacymch.github.io/wallpapers/img/anime5.jpg',
                'https://stacymch.github.io/wallpapers/img/anime6.jpeg',
                'https://stacymch.github.io/wallpapers/img/anime7.jpg',
                'https://stacymch.github.io/wallpapers/img/anime8.jpg',
                'https://stacymch.github.io/wallpapers/img/anime9.jpg'
            ];


    
    //адрес юзера в телеграм
    let chat_id = 224039891;

    //функция рассылки
    setInterval(function() {

    //запускаем рассыльщик уведомлений через каждые 5 секунд
    sender();

    },5000);

    
    //записываем в переменную текущее время
    //https://stackoverflow.com/questions/38816337/convert-javascript-date-format-to-yyyy-mm-ddthhmmss
    let now = new Date(); //Fri Dec 09 2022 01:50:22 GMT+0300 (Москва, стандартное время)

    //задаем формат, чтобы совпадал с форматом из datetime-local, обманывая метод toISOString() путем передачи ему текущего времени в нужном часовом поясе, обращенного в строку с подстановкой "UTC" вместо "GMT+0300"
    now = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split(':'); //сплитом разрезаем по ":", чтобы отрезать секунды
    now = now[0] + ':' + now[1]; // заново склеиваем первые два разрезанных элемента путем конкатенации (без третьего - секунд)
    console.log(now); // теперь все в нужном формате 2022-12-09T02:39

    function sender() {

        //бежим по всем доскам в модели
        for (let i = 0; i < data['boards'].length; i++) {

            //бежим по всем колонкам доски
            for (let j = 0; j < data['boards'][i]['columns'].length; j++) {

                //бежим по всем карточкам колонки
                for (let k = 0; k < data['boards'][i]['columns'][j]['cards'].length; k++) {

                   //делаем рассылку задачи, ЕСЛИ ВРЕМЯ ЗАДАЧИ СОВПАДАЕТ С ТЕКУШИМ ВРЕМЕНЕМ ИЗ ПЕРЕМЕННОЙ
                    if (data['boards'][i]['columns'][j]['cards'][k]['time'] == now) {

                        //отправка события в телеграм через функцию sendMessage
                        sendMessage(data['boards'][i]['columns'][j]['cards'][k]['title'] + ': ' + data['boards'][i]['columns'][j]['cards'][k]['description'], chat_id);
                    
                        //ставим отметку, что уже отправлялось, убирая время
                        data['boards'][i]['columns'][j]['cards'][k]['time'] = '';
                    }

                }

            }
        
        }

        save();

    }

        //функция для отправки сообщения
        function sendMessage(text, chat_id) {

            //формируем адрес запроса
            let url = 'https://api.telegram.org/bot5961340785:AAH-YJfTqTFVxjIoldnsXreEnS16542_6SM/sendMessage?chat_id=' + chat_id + '&text=' + text;
        
            //отправляем запрос на этот адрес
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true); //тут мы отправляем данные асинхронно и не ждем ответа (не нужно узнавать, отправилось сообщение или нет
            xhr.send();
    }

    console.log(data);
    
    //номер текущей доски достаем из хранилища
    let currentBoardId = localStorage.getItem('current_board');

    //если еще не сохраняли номер
    if(currentBoardId == null) {
        currentBoardId = 0;
    }

    renderBoards();

    //функция, чтобы открыть и спрятать меню справа
    function toggleMenu() {

        //запускает отрисовку тайлов с фонами
        renderBackgrounds();
        
        //toogle добавляет элементу с данным id класс sidebar-active, если его нет, и убирает, если он есть
        document.getElementById('sidebar').classList.toggle('sidebar-active');
    }

        //функция, чтобы открыть и спрятать меню слева
        function toggleBoardsList() {

            //toogle добавляет элементу с данным id класс sidebar-active, если его нет, и убирает, если он есть
            document.getElementById('side-menu').classList.toggle('side-menu-active');
        }

    //функция сохранения
    function save() {

        //кодируем data в json
        let dataJson = JSON.stringify(data);

        //сохраняем в localStorage
        localStorage.setItem('boards',dataJson);

        //сохраняем номер текущей доски
        localStorage.setItem('current_board', currentBoardId);
    }

    //функция фактической замены фона доски
    function changeBackground() {

        //получаем картинку из плитки
        let background = event.target.getAttribute('data-background');

        //вносим картинку из плитки в JSON-модель
        data['boards'][currentBoardId]['backgrounds'] = background;

        renderBoards();

        save();
    }

    //функция для переключения досок
    function changeBoard() {

        //определяем номер доски, на которую кликнули
        let num = event.target.getAttribute('data-num');

        //меняем текущий номер доски
        currentBoardId = num;

        //перерисовываем доски с учетом номера текущей доски
        renderBoards();

        //закрываем меню
        toggleBoardsList();

        save();

    }

    //функция отрисовки плиток с фоном
    function renderBackgrounds() {

        //получаем шаблон
        let tmpl_background = document.getElementById('tmpl-background').innerHTML;

        //находим, куда отрисовывать
        let container = document.getElementById('tile');

        //очищаем контейнер
        container.innerHTML = '';

        //отрисовываем его с добавлением содержимого в цикле
        for (let i = 0; i < backgrounds.length; i++) { 

            container.innerHTML += tmpl_background.replace('${background_image}', backgrounds[i])
                                                  .replace('${background_image}', backgrounds[i]);
        }


    }

        //функция отрисовки списка досок
        function renderBoardsList() {

            //получаем шаблон
            let tmpl_board = document.getElementById('tmpl-board-line').innerHTML;
    
            //находим, куда отрисовывать
            let container = document.getElementById('boards-list');

            //очищаем контейнер
            container.innerHTML = '';
    
            //отрисовываем его с добавлением содержимого в цикле
            for (let i = 0; i < data['boards'].length; i++) { 
    
                container.innerHTML += tmpl_board.replace('${board_num}', i)
                                                 .replace('${board_title}', data['boards'][i]['title'])
                                                 .replace('${board_num}', i);
            }
    
    
        }

    //функция отрисовки досок
    function renderBoards() {

        //получаем шаблоны
        let tmpl_board = document.getElementById('tmpl-board').innerHTML;
        let tmpl_column = document.getElementById('tmpl-column').innerHTML;
        let tmpl_card = document.getElementById('tmpl-card').innerHTML;

        //находим контейнер под доски
        let container = document.getElementById('boards');

        //очищаем доски
        container.innerHTML = '';

        //в цикле подставляем данные в шаблоны (СОБИРАЕМ ДОСКИ)
        for (let i = 0; i < data['boards'].length; i++ ) {

            //если номер доски в списке не совпадает с номером текущей доски, то не рисуем ее
            if (i != currentBoardId) {
                continue; //переход далее
            }


            //собираем html колонок доски  (СОБИРАЕМ КОЛОНКИ ДОСКИ)
            let boardColumns = '';
            for (let j = 0; j < data['boards'][i]['columns'].length; j++) { 


                //собираем html карточек колонки (СОБИРАЕМ КАРТОЧКИ КОЛОНКИ)
                let columnCards = '';
                for (let k = 0; k < data['boards'][i]['columns'][j]['cards'].length; k++) {

                    //html одной карточки
                    let cardHtml = tmpl_card.replace('${card_header}',data['boards'][i]['columns'][j]['cards'][k]['title'])
                                            .replace('${card_content}',data['boards'][i]['columns'][j]['cards'][k]['description'])
                                            .replace('${card_notification}',data['boards'][i]['columns'][j]['cards'][k]['time'])
                                            .replace('${card_notification}',(data['boards'][i]['columns'][j]['cards'][k]['time'] != '') ? '&#9716;' : '')
                                            .replace('${column_number}',j)
                                            .replace('${card_number}',k)
                                            .replace('${board_number}',i);
                                              

                    //добавляем готовый текст карточки к картокам КОЛОНКИ
                    columnCards += cardHtml;

                }

                //html одной колоночки
                let columnHtml = tmpl_column.replace('${column_header}',data['boards'][i]['columns'][j]['title'])
                                            .replace('${column_number}',j)
                                            .replace('${column_number}',j)
                                            .replace('${board_number}',i)
                                            .replace('${column_number}',j)
                                            .replace('${column_content}',columnCards)
                                            .replace('${column_number}',j)
                                            .replace('${column_number}',j);

                //добавляем готовый текст КОЛОНКИ к колонкам ДОСКИ
                boardColumns += columnHtml;

            }

            //подстваляем данные в шаблон доски и добавляем в контейнер
            container.innerHTML += tmpl_board.replace('${board_header}',data['boards'][i]['title'])
                                             .replace('${board_background}',data['boards'][i]['backgrounds']) 
                                             .replace('${board_background}',data['boards'][i]['backgrounds']) 
                                             .replace('${board_number}',i) 
                                             .replace('${board_number}',i) 
                                             .replace('${board_content}',boardColumns);
        }

        renderBoardsList();
    }

    //функция переименования доски
    function boardRename(number) {

        let name = event.target.value;

        data['boards'][number]['title'] = name;

        save();
    }

    //функция для создания новой доски
    function boardAdd() {

        //создаем объект пустой доски
        let board = {
                "title":"",
                "columns":[
                    {
                        "title":"",
                        "cards":[]
                    }
                ]
            };

        //добавляем объект в модель
        data['boards'].push(board);

        //переключаемся на новую доску
        currentBoardId = data['boards'].length - 1;

        //отрисовывать доску
        renderBoards();

        //закрываем меню
        toggleBoardsList();

        //сохранить модель
        save();
    }

    function boardDelete(number) {

        //спросить подтверждение
        let ok = confirm('Вы действительно хотите удалить доску?');

        if (ok) {
        //сплайсим из модели текущую доску по номеру
        data['boards'].splice(number,1);

        //сохраняем
        save();

        //меняем текущий номер доски на 0
        currentBoardId = 0;

        //перерисовываем
        renderBoards();
    }
}

    //функция создания колонки
    function columnAdd(){

        //создаем пустую колонку
        let column = {
                        "title":"",
                        "cards":[]
                     }; 

        //добавляем колонку на доску
        data['boards'][currentBoardId]['columns'].push(column)  

        //вывести модель в консоль
        console.log(data);  

        //перерисовываем доски
        renderBoards();   

        save();     
        
    }

    //функция переименования колонки
    function columnRename(number) {

        //определяем содержимое инпута
        let name = event.target.value;

        //перезаписываем имя колонки в модели
        data['boards'][currentBoardId]['columns'][number]['title'] = name;

        //сохраняем
        save();
    }

    //функция для удаления колонок
    function columnDelete(number) {

        //спросить подтверждение
        let ok = confirm("Вы действительно хотите удалить колонку?");  //true / false

        if (ok) {

            //удаляем колонку из модели
            data['boards'][currentBoardId]['columns'].splice(number,1);

            //сохраняем
            save();

            //перерисовываем
            renderBoards();
        } 
        
    }

    //функция открытия формы для заполнения карточки по нажатию на "+ Добавить задачу", которая изначально скрыта
    function cardFormAdd(column_number) {

        //раскрываем ранее скрытую форму в нужной колонке
        document.getElementsByClassName('card-form-hidden')[column_number].style.display = 'block';
        console.log(document.getElementsByClassName('card-form-hidden'));//выдает индексный массив по кол-ву колонок

        //скрываем кнопку "+ Добавить задачу" в нужной колонке
        document.getElementsByClassName('add-card-form')[column_number].style.display = 'none';

        //сохраняем
        save();
       
    }

    //функция для отмены создания карточки (сброса формы) при клике на крестик
    function cancel(column_number) {

        //скрываем форму заполнения карточки в нужной колонке
        document.getElementsByClassName('card-form-hidden')[column_number].style.display = 'none';
        
        //возвращаем кнопку "+ Добавить задачу" в нужной колонке
        document.getElementsByClassName('add-card-form')[column_number].style.display = 'block';

    }

    //функция добавления карточки(задачи)
    function cardAdd(board_number,column_number) {

        //создаем пустую карточку
        let card = {};

        //получить содержимое текстового поля
        let title = event.target.closest('.card-form').querySelector('.card-title').value;
        let description = event.target.closest('.card-form').querySelector('.card-description').value;
        let time = event.target.closest('.card-form').querySelector('.card-time').value;
        console.log(time);

        //наполняем карточку полученными данными
        card['title'] = title;
        card['description'] = description;
        card['time'] = time;

        if (title || description) {
            //добавить карточку в модель
            data['boards'][board_number]['columns'][column_number]['cards'].push(card);

            //вывести модель в консоль
            console.log(data);

            //перерисовываем доски
            renderBoards(); 

            save();
        }

    }

    //функция удаления карточки
    function cardDelete(currentBoardId, column_number, card_number) {

        //спросить подтверждение
        let ok = confirm("Вы действительно хотите удалить карточку?");  //true / false

        if(ok) {

            //удаляем колонку из модели
            data['boards'][currentBoardId]['columns'][column_number]['cards'].splice(card_number,1);

            //сохраняем
            save();

            //перерисовываем
            renderBoards();
        } 

    }
