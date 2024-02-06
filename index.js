const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '6646051150:AAF62NOfhD3NN3s182BZ9TWKyF6ndRBFUhw';
const bot = new TelegramBot(token, {polling: true});
let ifItsJoined = false;
const userStates = new Map();
const channelUsername = '@outPatientAi';
const channelUsername2 = '@ProteinTeam';
const joined = ['عضو شدم', 'i joined', 'عضو شدم | i joined'];
let mainMenu = ['منو اصلی', 'main menu', 'منو اصلی | main menu'];
let bloodTest = ['ازمایش خون', 'blood test', "آزمایشم را بررسی کن🩸🧪|🩸🧪review my blood test"];
let userProfile = ['حساب کاربری شما📖✏️', 'your profile 📖✏️', 'حساب کاربری شما📖✏️ | your profile 📖✏'];
let aboutUs = ['درباره ما', 'about us', 'درباره ما | about us'];
let recipe = "نحوه پخت غذایم را آموزش بده 👨‍🍳|👨‍🍳 tell me how to cook";
let bloodTestText = 'لطفا عکس های هر صفحه ازمایش خود را به صورت کاملا واضح و صفحه به صفحه برای ما بفرستید پس از فرستادن هر صفحه از ازمایش در صورت باقی ماندن صفحات دکمه ادامه فرستادن عکس را بزنید \n please sent ous your blood test page by page and after sending each page if theres more click on continue sending'
let optionBloodTest = ["ادامه فرستادن عکس | continue sending", "نتیجه آزمایش | the final result"];
let recipeText = "لطفا نام غذای مورد نظرتان را بنویسید 🌭|🌭 please write the name of your food";
let promptBloodTest =  "Given a set of anonymized medical test results including blood work (CBC, lipid profile, glucose levels, liver and kidney function tests), vital signs (blood pressure, heart rate), and patient-reported outcomes (symptoms, dietary habits, physical activity levels), analyze the data to identify any abnormalities or areas of concern. Based on the analysis, provide a preliminary assessment highlighting potential health issues indicated by the test results. Then, offer general recommendations for dietary adjustments and lifestyle changes that could positively impact the identified conditions. These recommendations should emphasize a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats, as well as suggest a moderate-intensity exercise regimen suitable for the patient's age and general health status. Stress the importance of consulting with a healthcare provider for a comprehensive evaluation and personalized advice based on the test results."
let aboutUsText = `
ما در پروتئین، یک تیم پویا و نوآور در عرصه هوش مصنوعی هستیم. 🚀👨‍💻👩‍💻 با ارائه خدمات و سرویس‌های متنوع و خلاقانه، 🌟🛠️ می‌کوشیم تا دسترسی عموم جامعه به ابزارهای پیشرفته هوش مصنوعی را فراهم آوریم. هدف ما، تسهیل فعالیت‌های حرفه‌ای افراد شاغل از طریق به کارگیری قدرت هوش مصنوعی است. 💡🤖💼 ما بر این باوریم که هر فردی باید بتواند از مزایای این فناوری شگفت‌انگیز به نفع خود و جامعه‌اش بهره ببرد. 🌍❤️ با ما همراه باشید تا با هم آینده‌ای روشن‌تر و هوشمندتر بسازیم. 🌈🛠️🔮

At Protein, we are a dynamic and innovative team in the field of AI. 🚀👨‍💻👩‍💻 Offering a variety of creative services and solutions, 🌟🛠️ we strive to provide the public access to advanced AI tools. Our goal is to facilitate professional activities for working individuals by leveraging the power of AI. 💡🤖💼 We believe that everyone should have the opportunity to benefit from the wonders of this incredible technology for their own and societal good. 🌍❤️ Join us in building a brighter and smarter future together. 🌈🛠️🔮
`;
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
let promoteUs = ["با معرفی ما به دوستان خود از ما حمایت کنید .", 'share our robot with your friend', 'با معرفی ما به دوستان خود از ما حمایت کنید | share us with your friend'];
let channelJoin = `لطفا ابتدا عضو کانال‌های ${channelUsername} و ${channelUsername2} شوید.` + 'please first join these two channels';
let ifContinuePhoto = 'اگر همچنان میخواهید عکس اضافه کنید بر روی دکمه ادامه میدهم بزنید اگر عکس های ازمایش شما به صورت کامل فرستاده شده بر روی گزینه بررسی ازمایش بزنید. \n if you want to continue adding photo press continue . if its already done and you want to see the result press review it';
let changeFood = 'غدای رژیمم را عوض کن 🍕|🍕change the food of my diet';
let makeMeADiet = 'برام یک رژیم غذایی درست کن🥙|🥙make me a diet';
let wrongPhotoSending = "لطفا از منو گزینه درست را انتخاب کنید\nplease choose the right option from the menu"

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let name = msg.from.first_name + "";
    let surName = msg.from.last_name + "";
    let username = msg.from.username;
    let persian = "درود بر " + name;
    let english = "welcome " + name;
    let welcomeMessage = [persian, english];
    let userState = userStates.get(chatId);
    if (!userState) {
        userState = {
            IsRequestingBloodTest: false,
            isRequestingChangingFood: false,
            isRequestingChangingRecipe: false,
            isCompletingProfile: false,
            isInvitingFriend: false,
            orderingRecipe: false,
            photos: [],
            lastText: "",
            preferLanguage: "",
            tone: "",
            textTone: ""
        };
        userStates.set(chatId, userState);
    }

    if (msg.photo && msg.photo.length > 0) {
        if (userState.IsRequestingBloodTest) {
            // Get the highest resolution photo
            const fileId = msg.photo[msg.photo.length - 1].file_id;

            try {
                // Get the file path of the photo
                const filePath = await getFilePath(fileId);

                // Download the photo and convert it to base64
                const base64Image = await downloadImageAndGetBase64(filePath);

                // Here, you can do something with the base64Image string
                console.log(base64Image); // Or send it to another API, save it, etc.

                let helperPhotos = userState.photos;
                helperPhotos[helperPhotos.length] = base64Image;
                userStates.set(chatId, {
                    ...userState,
                    photos: helperPhotos
                });

                await bot.sendMessage(chatId, ifContinuePhoto, {
                    reply_markup: {
                        keyboard: [
                            [{text: optionBloodTest[0]}],
                            [{text: optionBloodTest[1]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });

            } catch (error) {
                console.error('Error processing the image:', error);
                await bot.sendMessage(chatId, "Failed to process image." + "خطا در بررسی عکس");
            }
            userStates.set(chatId, {
                ...userState,
                IsRequestingBloodTest: true
            });
        } else {
            await bot.sendMessage(chatId, wrongPhotoSending);
        }

    } else if (text === optionBloodTest[0]) {
        userStates.set(chatId, {
            ...userState,
            IsRequestingBloodTest: true
        });
    } else if (text === optionBloodTest[1]) {
        const object = {
            text : promptBloodTest,
            images : userState.photos
        }
        axios.post('http://localhost:3001/gpt4plus', object)
            .then((res) => {
                console.log(res.data);
                bot.sendMessage(chatId, res.data.choices[0].message.content);
                sendCustomMessage(bot, chatId);
            })
            .catch((error) => {
                console.error('Error sending data to server:', error);
            });
    } else if (text.startsWith('/start')) {
        console.log("this is id " + msg.from.id);
        console.log(msg.text);

        const args = msg.text.split(' '); // Splits the message into parts
        if (args.length > 1) {
            const referralId = args[1]; // The second part is the referral ID
            // Handle the referral logic here
            console.log(`User ${username || name} was referred by ${referralId}`);
            try {
                await axios.post('http://localhost:3001/invite', {
                    idChatInvitePerson: referralId,
                    idChatGuest: msg.from.id
                });
                console.log("its in the try");
            } catch (error) {
                console.log("its in the error");
                console.error('Error sending data to server:', error);
            }
        }
        console.log("its before is member");
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        let isMember2 = await checkChannelMembership2(chatId, msg.from.id);
        if (!(isMember && isMember2)) {
            console.log("should be here");
            try {
                await axios.post('http://localhost:3001/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    idChat: msg.from.id
                });
            } catch (error) {
                console.error('Error sending data to server:', error);
            }
            bot.sendMessage(chatId, channelJoin, {
                reply_markup: {
                    keyboard: [
                        [{text: joined[2]}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } else {
            console.log("is it in else ?");
            try {
                await axios.post('http://localhost:3001/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    bloodTestChannel: true,
                    idChat: msg.from.id
                });
                await bot.sendMessage(chatId, welcomeMessage[0]);
            } catch (error) {
                console.error('Error sending data to server:', error);
                await bot.sendMessage(chatId, error);
            }
            await sendCustomMessage(bot, chatId);
        }
        userStates.set(chatId, {
            IsRequestingBloodTest: false,
            isRequestingChangingFood: false,
            isRequestingChangingRecipe: false,
            isCompletingProfile: false,
            isInvitingFriend: false,
            orderingRecipe: false,
            photos: [],
            lastText: "",
            tone: "",
            textTone: ""
        });

    } else if (text === joined[2]) {
        console.log("this is id " + msg.from.id);
        // Check if the user is a member of the channel
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        let isMember2 = await checkChannelMembership2(chatId, msg.from.id);
        if (isMember && isMember2) {

            try {
                await axios.post('http://localhost:3001/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    bloodTestChannel: true,
                    idChat: msg.from.id
                });
                await bot.sendMessage(chatId, welcomeMessage[0]);
            } catch (error) {
                console.error('Error sending data to server:', error);
                await bot.sendMessage(chatId, error);
            }

            // await bot.sendMessage(chatId, welcomeMessage);
            await sendCustomMessage(bot, chatId);


        } else {
            bot.sendMessage(chatId, channelJoin, {
                reply_markup: {
                    keyboard: [
                        [{text: joined[2]}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
    } else if (text === mainMenu[2]) {
        userStates.set(chatId, {
            ...userState,
            lastText: "",
            IsRequestingBloodTest: false,
            orderingRecipe: false,
            photos : []
        });
        await sendCustomMessage(bot, chatId);
    } else if (text === recipe) {
        await bot.sendMessage(chatId, recipeText);

        userStates.set(chatId, {
            ...userState,
            orderingRecipe: true
        });
    } else if (text === bloodTest[2]) {
        await bot.sendMessage(chatId, bloodTestText);
        userStates.set(chatId, {
            ...userState,
            IsRequestingBloodTest: true
        });
    } else if (userState.orderingRecipe) {
        const object = {
            message: `رسپی این غذا را هم به فارسی هم به انگلیسی به اندازه یک نفر بنویس و به صورت کامل و ریز به ریز توضیح بده :غدا مورد نظر [${text}]`,
            idChat: chatId
        }

        axios.post('http://localhost:3001/gpt4', object)
            .then((res) => {
                console.log(res.data);
                bot.sendMessage(chatId, res.data);
                sendCustomMessage(bot, chatId);
            })
            .catch((error) => {
                console.error('Error sending data to server:', error);
            });
        userStates.set(chatId, {
            ...userState,
            orderingRecipe: false
        });

    } else if (text === aboutUs[2]) {
        await bot.sendMessage(chatId, aboutUsText);
        await sendCustomMessage(bot, chatId);
    } else {
    }
});


bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const data = callbackQuery.data;

    // Handle language selection
    if (data.startsWith('set_language_')) {
        const selectedLanguage = data.split('_')[2];
        let userState = userStates.get(chatId);
        if (selectedLanguage === 'english' || selectedLanguage === 'persian') {
            userState.preferLanguage = selectedLanguage;
            console.log(userState);
            bot.sendMessage(chatId, `Language set to ${selectedLanguage}. ${mainMenu[selectedLanguage === 'english' ? 1 : 0]}`);

        }
    }

    // Additional callback query handling if needed
});


async function sendCustomMessage(bot, chatId) {
    await bot.sendMessage(chatId, promoteUs[2], {
        reply_markup: {
            keyboard: [
                [{text: bloodTest[2]}],
                [{text: makeMeADiet}],
                [{text: changeFood}],
                [{text: recipe}],
                [{text: aboutUs[2]}],
                [{text: userProfile[2]}]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}


async function checkChannelMembership(chatId, userId) {
    try {
        const member = await bot.getChatMember(channelUsername, userId);
        return member && (member.status === 'member' || member.status === 'administrator' || member.status === 'creator');
    } catch (error) {
        console.error('Error checking channel membership:', error);
        bot.sendMessage(chatId, 'خطا در بررسی عضویت کانال.' + ' | ' + "you are not a member of channels");
        return false;
    }
}

async function checkChannelMembership2(chatId, userId) {
    try {
        const member = await bot.getChatMember(channelUsername2, userId);
        return member && (member.status === 'member' || member.status === 'administrator' || member.status === 'creator');
    } catch (error) {
        console.error('Error checking channel membership:', error);
        bot.sendMessage(chatId, 'خطا در بررسی عضویت کانال.' + ' | ' + "you are not a member of channels");
        return false;
    }
}

async function getFilePath(fileId) {
    const response = await bot.getFile(fileId);
    return response.file_path;
}

async function downloadImageAndGetBase64(filePath) {
    const url = `https://api.telegram.org/file/bot${token}/${filePath}`;
    const response = await axios.get(url, {responseType: 'arraybuffer'});

    // Infer the MIME type from the file extension
    const mimeType = getMimeType(filePath);
    console.log("this is memetype----------------");
    console.log(mimeType);
    console.log("this is memetype----------------");
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:${mimeType};base64,${base64Image}`;
}

function getMimeType(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        default:
            return 'application/octet-stream'; // Default binary type
    }
}
