const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '6646051150:AAF62NOfhD3NN3s182BZ9TWKyF6ndRBFUhw';
const bot = new TelegramBot(token, {polling: true});
let ifItsJoined = false;
const userStates = new Map();
const channelUsername = '@outPatientAi';
const channelUsername2 = '@ProteinTeam';
const messageChargeOption1 = "شارژ حساب کاربری | Charge your account";
const messageChargeByInvite = 'استفاده مجدد از ربات با دعوت دوستان\ninvite friends to get free subscription';
const QuestionTrick = ["سوخت و ساز بدن زن و مرد با هم متفاوته برای همین قبل از هر چیزی باید جنسیتت رو بدونیم. 👨‍🦰👱‍\n👨‍🦰👱‍️ The metabolism of men and women is different, so first of all, we need to know your gender."];
const goalsOfTheDiet = ["هدف اصلی شما از رژیم چیست | whats your primary goal", "کم کردن وزن | weight loss", "عضله سازی | muscle gain", "سبک زندگی سالم | healthy life", "هدف ثانویه شما از رژیم چیست | whats your secondary goal of diet"];
const cookingPreference = ["ترجیحات رژیمی شما چیست ؟ |?Whats your cuisine preferences", "رژیم مدیترانه‌‌ای | Mediterranean diet", "رژیم کتوژنیک | Ketogenic Diet", "رژیم کم کربوهیدرات | Low-carb Diet", "روزه‌داری متناوب | Intermittent Fasting", "رژیم دیابتی | Diabetes diet", "رژیم سالم عادی | Normal healthy diet", "بدون ترجیحات | No preferences"]
const joined = ['عضو شدم', 'i joined', 'عضو شدم | i joined'];
let successInvite = "به حساب شما دسترسی مجدد به ربات داده شد";
let inviteAlert = 'پروتئینی عزیز باید حداقل ۲ نفر از دوستانت را با استفاده از لینک زیر به ربات ما دعوت کنی  | you should at least invite two people to get free subscription';
const supplement = ["چه مکمل هایی مصرف میکنید ؟ |?what supplement do you use", "مولتی ویتامین | multivitamin", "شیک پروتئینی | protein shake", "هیچکدام | none"];
const healthCondition = ["وضعیت سلامتی شما چگونه است ؟ | ?whats your health condition", "دیابت نوع ۱ | diabetes type 1", "دیابت نوع ۲ | diabetes type 2", "فشار خون بالا | high blood pressure", "کبد چرب | fatty liver", "یائسگی | menopause", " کلسترول بالا | high cholesterol", "بیماری قلبی | heart diseases", "کاملا سالم | healthy"];
const allergy = ["اگر آلرژی خاصی دارید لطفا آن را بنویسد در غیر این صورت بر روی گزینه ندارم کلیک کنید \n if you have a specific allergy you can write it down and if you don't click on i don't ", "ندارم | I don't"];
let sportClub = ["آیا به باشگاه دسترسی دارید یا میخواهید در خانه تمرین کنید ؟| ?can you go to gym or you prefer training at home", "باشگاه میروم | i can go to gym", "در خانه تمرین میکنم | I prefer workout at home"];
let mainMenu = ['منو اصلی', 'main menu', 'منو اصلی | main menu'];
const surprise = "[اگه به برنامه تغذیه ای ما که با استفاده از 🔥🔥هوشمند ترین🔥🔥 برنامه کامپیوتری ایجاد شده پایبند باشی خیلی راحت به وزن ایده آلت میرسی. سایر کاربران به طور متوسط ماهانه 🤯🤩۳🤯🤩 کیلوگرم کاهش وزن دارند.\n\nIf you stick to our diet plan, which is created using the 🔥🔥smartest🔥🔥 computer program, you'll easily reach your ideal weight. Other users lose an average of 🤯🤩3🤯🤩 kilograms per month.\n]";
let physicalLever = ["سطح فعالیت فیزیکی شما \n Your physical activity level", "بی تحرک | Sedentary", "فعالیت سبک | lightly Active", "فعالیت متوسط | Moderately active", "بسیار فعال | Very Active"];
let createSportProgram = "برام یک برنامه ورزشی درست کن 💪|💪make me a sport program";
let disability = ["اگر مشکلات پزشکی یا محدودیت جسمی دارید بر روی دکمه توضیح مشکلات بزنید \n if you have a medical problem or disability please press explain your problem", "توضیح مشکل | explain the problem", "مشکلی ندارم | I dont have problem"]
let bloodTest = ['ازمایش خون', 'blood test', "آزمایشم را بررسی کن🩸🧪|🩸🧪review my blood test"];
const foodRegion = ["غذای شما به سبک چه کشوری باشد ؟ |?What country style should your food be", "غذای ایرانی | Persian food", "غذای ایتالیایی | Italian food", "برام مهم نیست | I dont care"];
let userProfile = ['حساب کاربری شما📖✏️', 'your profile 📖✏️', 'حساب کاربری شما📖✏|📖✏your profile'];
let tellMeHowToDoIt = ["اگر نحوه انجام حرکت ورزشی مورد نظر خود را بلد نیستید از داخل منو بخش اموزش حرکات ورزشی میتوانید نحوه انجام ان را ببنید\nif you dont know how to do these move you can go to the menu and choose the option tell me how to do it and see the instruction of the move ", "چجوری این حرکت رو انجام بدم💪🏻|💪🏻tell me how to do it", "💪🏻", "فقط نام حرکتت را بنویس تا نحوه اجرای آن رو بهت آموزش بدم \n just write the name of your move so i tell you how to do it", "چند لحظه صبر کن تا اطلاعات حرکت مورد نظرت رو بهت بدم \n in a few seconds i will send you the move information"];
let aboutUs = ['درباره ما', 'about us', 'درباره ما | about us'];
let TextStepsProcessSportProgram = ["لطفا سن خود راانتخاب کنید\nplease choose your age ", "اگر الان نمیخواهید برنامه ورزشی بسازید بر روی دکمه منو بزنید\nif you don't want to create a sport program right now click on the menu button  "]
let recipe = "نحوه پخت غذایم را آموزش بده 👨‍🍳|👨‍🍳 tell me how to cook";
let bloodTestText = 'لطفا عکس های هر صفحه ازمایش خود را به صورت کاملا واضح و صفحه به صفحه برای ما بفرستید پس از فرستادن هر صفحه از ازمایش در صورت باقی ماندن صفحات دکمه ادامه فرستادن عکس را بزنید. ⚠️⚠️⚠️اگر عکس ها به صورت کاملا واضح فرستاده نشوند احتمال اشتباه ربات بسیار زیاد است. ⚠️⚠️⚠️\n please sent ous your blood test page by page and after sending each page if theres more click on continue sending ⚠️⚠️⚠️if you dont send clear photo the bot may make mistake⚠️⚠️⚠️ / '
let optionBloodTest = ["ادامه فرستادن عکس | continue sending", "نتیجه آزمایش | the final result"];
let recipeText = "لطفا نام غذای مورد نظرتان را بنویسید 🌭|🌭 please write the name of your food";
let hours = "چند ساعت در هفته میتوانید برای برنامه تمرینی وقت بگذارید\n How much time can you devote to exercise per week?";
let plansMessage = "";
let goalOfActivity = ["هدف ورزشی شما چیست؟ 🏹|🏹 ?whats your goal", "وزن کم کنید | lower your weight", "عضله سازی کنید | build muscle", "استقامت خود را افزایش دهید | Increase your stamina"];
let levelOfActivity = ["سطح فعلی فعالیت شما به چه اندازه است | Whats the level of your activity right now", "تازه کار هستید | newcomer", "سطح متوسطی دارید | Moderate activity level", "ورزشکار حرفه ای هستید | your professional athlete"]
let personalQuestions = ["حنسیت خود را مشخص کنید | please choose your sexuality", "مرد | male", "زن | female", "وزن شما چند کیلوگرم است | whats your weight", "قد شما چند است | whats your heights"];
let dualLanguageResult = "نتیجه آزمایش شما به دو زبان انگلیسی و فارسی برای شما ارسال خواهد شد لطفا صبور باشید معمولا بین ۲ تا ۴ دیقه بررسی ازمایش زمان خواهد برد\nthe result will send in English and persian language please be patient the result need 2 to 4 minutes process to be prepared";
let promptBloodTest = "Given a set of anonymized medical test results including blood work (CBC, lipid profile, glucose levels, liver and kidney function tests), vital signs (blood pressure, heart rate), and patient-reported outcomes (symptoms, dietary habits, physical activity levels), analyze the data to identify any abnormalities or areas of concern. Based on the analysis, provide a preliminary assessment highlighting potential health issues indicated by the test results. Then, offer general recommendations for dietary adjustments and lifestyle changes that could positively impact the identified conditions. These recommendations should emphasize a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats, as well as suggest a moderate-intensity exercise regimen suitable for the patient's age and general health status. Stress the importance of consulting with a healthcare provider for a comprehensive evaluation and personalized advice based on the test results."
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
let bloodTestPersianAndEnglishAlert = ["نسخه انگلیسی جواب آزمایش\n this the english result of the test", "نسخه فارسی نیز تا حداکثر دو دقیقه دیگر برای شما ارسال خواهد شد|the persian result will send you within two minutes", "نسخه فارسی جواب آزمایش\n this the Persian result of the test"]
bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        let name = msg.from.first_name + "";
        let surName = msg.from.last_name + "";
        let username = msg.from.username;
        let persian = "درود بر " + name;
        let english = "welcome " + name;
        let welcomeMessage = [persian, english];
        plansMessage = `سلام ${name} عزیز! 🌈
خوشحالیم که می‌خوای با ما همراه باشی. برای شارژ حساب کاربریت و استفاده از 3 درخواست از ربات، فقط کافیه 69 هزار تومان به شماره کارت زیر واریز کنی و فیش پرداختی رو برامون ارسال کنی. 😊💳
شماره کارت: 🏦
5054 1610 1394 1236
نام صاحب کارت: ✨
عرفان اصفهانیان
به محض اینکه فیش پرداختی رو به اکانت زیر در تلگرام بفرستی، حساب کاربریت شارژ می‌شه. ⏰🚀
@nothingtoexplaintoyou
اگر خارج از ایران هستی و دوست داری از ربات ما استفاده کنی، لطفاً به آیدی زیر پیام بده تا روش‌های پرداخت بین‌المللی رو برات توضیح بدیم. 🌍💬
برای اطلاعات بیشتر پیام بده:
@nothingtoexplaintoyou
مرسی که پروتئینی  هستی!  🎉💐

Hello dear ${name}! 🌈

We're thrilled that you want to join us. To recharge your user account and enjoy 3 requests, you just need to transfer 1.2 Euro to the following IBAN number and send us the payment receipt. 😊💳

IBAN Number:
LT023250069833288118

As soon as you send the payment slip to our account on Telegram, your user account will be charged within a maximum of one hour. ⏰🚀
@nothingtoexplaintoyou

Thank you for being awesome! 🎉💐`;


        let userState = userStates.get(chatId);
        if (!userState) {
            userState = {
                IsRequestingBloodTest: false,
                isRequestingChangingFood: false,
                isRequestingChangingRecipe: false,
                isMakingDiet: false,
                isInvitingFriend: false,
                orderingRecipe: false,
                isRequestingSportProgram: false,
                finalRequest: false,
                requestExplainingSportMove: false,
                photos: [],
                lastText: "",
                preferLanguage: "",
                tone: "",
                textTone: ""
            };
            userStates.set(chatId, userState);
        }

        if (msg.document || msg.voice) {
            console.log("It's here - received a document or voice message");
            // Optionally, send a message back to the user indicating the unsupported file type
            await bot.sendMessage(chatId, "لطفا اگر در حال فرستادن آزمایش خود هستید هر صفحه را به صورت عکس به ترتیب بفرستید و پس از فرستادن هر عکس منتظر جواب ربات برای فرستادن عکس بعدی باشید");
            await bot.sendMessage(chatId, "if you are sending data for your blood test please send image of each page and wait for the response of the robot to send other images");
            userStates.set(chatId, {
                ...userState,
                lastText: "",
                tone: "",
                IsRequestingBloodTest: false,
                orderingRecipe: false,
                isRequestingSportProgram: false,
                finalRequest: false,
                isMakingDiet: false,
                requestExplainingSportMove: false,
                photos: []
            });
            await sendCustomMessage(bot, chatId);
        } else if (msg.photo && msg.photo.length > 0) {
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

        } else if (text === makeMeADiet) {
            await bot.sendMessage(chatId, "🍟");
            userStates.set(chatId, {
                ...userState,
                isMakingDiet: true,
                tone: "",
                lastText: ""
            });
            await bot.sendMessage(chatId, QuestionTrick[0], {
                reply_markup: {
                    keyboard: [
                        [{text: personalQuestions[1]}],
                        [{text: personalQuestions[2]}],
                        [{text: mainMenu[2]}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } else if (text === mainMenu[2]) {
            userStates.set(chatId, {
                ...userState,
                lastText: "",
                tone: "",
                IsRequestingBloodTest: false,
                orderingRecipe: false,
                isRequestingSportProgram: false,
                finalRequest: false,
                isMakingDiet: false,
                requestExplainingSportMove: false,
                photos: []
            });
            await sendCustomMessage(bot, chatId);
        } else if (userState.isMakingDiet) {
            if (userState.tone === "") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "1",
                    lastText: "I am a : " + (text === "مرد | male" ? "male" : (text === "زن | female" ? "female" : text)) + " and have "
                });
                let objectKeyboard = [];
                for (let i = 4; i < 100; i++) {
                    objectKeyboard[objectKeyboard.length] = [{text: i}];
                }
                objectKeyboard[objectKeyboard.length] = [{text: mainMenu[2]}];
                await bot.sendMessage(chatId, TextStepsProcessSportProgram[0], {
                    reply_markup: {
                        keyboard: objectKeyboard,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "1") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "2",
                    lastText: userState.lastText + text + " years old with the ",
                });
                let possibleHeight = [];
                for (let i = 30; i < 230; i++) {
                    possibleHeight[possibleHeight.length] = [{text: i + " cm"}];
                }
                possibleHeight[possibleHeight.length] = [{text: mainMenu[2]}];
                await bot.sendMessage(chatId, personalQuestions[4], {
                    reply_markup: {
                        keyboard: possibleHeight,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "2") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "3",
                    lastText: userState.lastText + text + " height and also my weight is ",
                });
                let objectArrayKeyboard = []
                for (let i = 20; i < 180; i++) {
                    objectArrayKeyboard[objectArrayKeyboard.length] = [{text: i + " kilo gram"}];
                }
                objectArrayKeyboard[objectArrayKeyboard.length] = [{text: mainMenu[2]}]
                await bot.sendMessage(chatId, personalQuestions[3], {
                    reply_markup: {
                        keyboard: objectArrayKeyboard,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "3") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "4",
                    lastText: userState.lastText + text + " ,I'm seeking a highly customized weekly diet plan aimed at achieving a ",
                });
                // goalsOfTheDiet
                await bot.sendMessage(chatId, goalsOfTheDiet[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: goalsOfTheDiet[1]}],
                            [{text: goalsOfTheDiet[2]}],
                            [{text: goalsOfTheDiet[3]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "4") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "5",
                    lastText: userState.lastText + (text === "کم کردن وزن | weight loss" ? "weight loss" :
                        text === "عضله سازی | muscle gain" ? "muscle gain" :
                            text === "سبک زندگی سالم | healthy life" ? "healthy life" :
                                text) + " ,while also supporting a ",
                });
                await bot.sendMessage(chatId, goalsOfTheDiet[4], {
                    reply_markup: {
                        keyboard: [
                            [{text: goalsOfTheDiet[1]}],
                            [{text: goalsOfTheDiet[2]}],
                            [{text: goalsOfTheDiet[3]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "5") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "6",
                    lastText: userState.lastText + (text === "کم کردن وزن | weight loss" ? "weight loss" :
                        text === "عضله سازی | muscle gain" ? "muscle gain" :
                            text === "سبک زندگی سالم | healthy life" ? "healthy life" :
                                text) + " ",
                });
                // the next option should be written by the user
                await bot.sendMessage(chatId, allergy[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: allergy[1]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "6") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "7",
                    lastText: userState.lastText + (text === "ندارم | I don't" ? "I don't have allergic" : text) + " allergy" + ". I engage in ",
                });
                // physicalLever
                await bot.sendMessage(chatId, physicalLever[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: physicalLever[1]}],
                            [{text: physicalLever[2]}],
                            [{text: physicalLever[3]}],
                            [{text: physicalLever[4]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "7") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "8",
                    lastText: userState.lastText +
                        (text === "بی تحرک | Sedentary" ? "Sedentary" :
                            text === "فعالیت سبک | lightly Active" ? "lightly Active" :
                                text === "فعالیت متوسط | Moderately active" ? "Moderately active" :
                                    text === "بسیار فعال | Very Active" ? "Very Active" : text) + "level of activity per week. I adhere to ",
                });
                await bot.sendMessage(chatId, cookingPreference[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: cookingPreference[6]}],
                            [{text: cookingPreference[7]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "8") {
                const dietTranslations = {
                    "رژیم مدیترانه‌‌ای | Mediterranean diet": "Mediterranean diet",
                    "رژیم کتوژنیک | Ketogenic Diet": "Ketogenic Diet",
                    "رژیم کم کربوهیدرات | Low-carb Diet": "Low-carb Diet",
                    "روزه‌داری متناوب | Intermittent Fasting": "Intermittent Fasting",
                    "رژیم دیابتی | Diabetes diet": "Diabetes diet",
                    "رژیم سالم عادی | Normal healthy diet": "No preferences",
                    "بدون ترجیحات | No preferences": "No preferences"
                };
                const translatedDiet = dietTranslations[text] || text;
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "9",
                    lastText: userState.lastText + translatedDiet,
                });
                await bot.sendMessage(chatId, supplement[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: supplement[1]}],
                            [{text: supplement[2]}],
                            [{text: supplement[3]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "9") {
                const dietTranslations = {
                    "شیک پروتئینی | protein shake": ". For supplements, I take a protein shake ",
                    "مولتی ویتامین | multivitamin": ". For supplements, I take a multivitamin ",
                    "هیچکدام | none": ""
                };
                const translatedDiet = dietTranslations[text] || text;
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "10",
                    lastText: userState.lastText + translatedDiet,
                });
                await bot.sendMessage(chatId, healthCondition[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: healthCondition[1]}],
                            [{text: healthCondition[2]}],
                            [{text: healthCondition[3]}],
                            [{text: healthCondition[4]}],
                            [{text: healthCondition[5]}],
                            [{text: healthCondition[6]}],
                            [{text: healthCondition[7]}],
                            [{text: healthCondition[8]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "10") {
                // "دیابت نوع ۱ | diabetes type 1", "دیابت نوع ۲ | diabetes type 2", "فشار خون بالا | high blood pressure", "کبد چرب | fatty liver", "یائسگی | menopause" , " کلسترول بالا | high cholesterol" , "بیماری قلبی | heart diseases" , "کاملا سالم | healthy"
                const dietTranslations = {
                    "کاملا سالم | healthy": " Considering that i'm completely healthy",
                    "بیماری قلبی | heart diseases": " Considering my heart diseases problem",
                    " کلسترول بالا | high cholesterol": " Considering my high cholesterol problem",
                    "یائسگی | menopause": "Considering my high menopause problem",
                    "کبد چرب | fatty liver": "Considering my high fatty liver problem",
                    "فشار خون بالا | high blood pressure": "Considering my high blood pressure problem",
                    "دیابت نوع ۲ | diabetes type 2": "Considering my diabetes type 2 problem",
                    "دیابت نوع ۱ | diabetes type 1": "Considering my diabetes type 1 problem"
                };
                const translatedDiet = dietTranslations[text] || text;
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "11",
                    lastText: userState.lastText + translatedDiet,
                });
                let hoursActivity = [];
                for (let i = 1; i < 40; i++) {
                    hoursActivity[hoursActivity.length] = [{text: i + "hours"}]
                }
                hoursActivity[hoursActivity.length] = [{text: mainMenu[2]}];

                await bot.sendMessage(chatId, hours, {
                    reply_markup: {
                        keyboard: hoursActivity,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
            } else if (userState.tone === "11") {
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "12",
                    lastText: userState.lastText + "and the amount of time I can devote to sports is " + text + "  per week." + " meals should be balanced to manage blood sugar levels. My weekly food budget is moderate, and while I have access to a wide range of grocery stores, seasonal and local produce is preferred to ensure freshness.",
                });
                await bot.sendMessage(chatId, foodRegion[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: foodRegion[1]}],
                            [{text: foodRegion[2]}],
                            [{text: mainMenu[2]}],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
            } else if (userState.tone === "12") {
                // "غذای ایرانی | Persian food", "غذای ایتالیایی | Italian food", "برام مهم نیست | I dont care"];
                let translatedDiet = ""
                if (text === foodRegion[1]) {
                    translatedDiet = "I prefer meals be Persian food";
                } else if (text === foodRegion[2]) {
                    translatedDiet = "I prefer meals be Italian food";
                } else if (text === foodRegion[3]) {
                    translatedDiet = "";
                }
                console.log(translatedDiet);
                userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: true,
                    tone: "13",
                    lastText: "Please create a 7 days diet for me and explain every meal and snacks for me try that every day be different from each other day and I want you to explain every day meals and snacks very much and explain it completely and i want to know the calorie of every meals and snacks " + translatedDiet + " here it is my information :  " + userState.lastText
                });
                let possibleHeight = [];
                for (let i = 30; i < 230; i++) {
                    possibleHeight[possibleHeight.length] = [{text: i + " kg"}];
                }
                possibleHeight[possibleHeight.length] = [{text: mainMenu[2]}];
                await bot.sendMessage(chatId, "🫵🔥" + "برای ساخت رژیمت قدم نهایی اینه که وزن مورد علاقت تو ذهنت رو بهم بگی تا شخصی سازی ترین رژیم رو برات بسازیم \n \n \n Please give me your goal wight so i create the best diet for you " + "🫵🔥", {
                    reply_markup: {
                        keyboard: possibleHeight,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "13") {
                await bot.sendMessage(chatId, `${name} عزیز در حال ساخت رژیمتم`);
                await bot.sendMessage(chatId, `dear ${name} I'm creating your diet`);
                console.log(userState);

                const object = {
                    message: "**The most important thing is that i need the full explanation for each meal in every day so Please remember explain every day meals and snacks completely** " + userState.lastText,
                    idChat: chatId
                };
                await bot.sendMessage(chatId, surprise);
                await handleBotLogicDiet(bot, chatId, object);
                await userStates.set(chatId, {
                    ...userState,
                    isMakingDiet: false
                });

            }
        } else if (text === createSportProgram) {
            // [{text: joined[2]}]
            let objectKeyboard = [];
            for (let i = 4; i < 100; i++) {
                objectKeyboard[objectKeyboard.length] = [{text: i}];
            }
            objectKeyboard[objectKeyboard.length] = [{text: mainMenu[2]}];

            await bot.sendMessage(chatId, "بیا با هم یه برنامه ورزشی بسازیم که همیشه سالم بمونی \n lets create a sport program and be healthy");
            await bot.sendMessage(chatId, "⚽️");
            await bot.sendMessage(chatId, TextStepsProcessSportProgram[0], {
                reply_markup: {
                    keyboard: objectKeyboard,
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
            userStates.set(chatId, {
                ...userState,
                isRequestingSportProgram: true
            });
        } else if (userState.isRequestingSportProgram) {
            if (userState.tone === "") {
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: true,
                    lastText: "the age is " + text + " ",
                    tone: "1"
                });

                await bot.sendMessage(chatId, personalQuestions[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: personalQuestions[1]}],
                            [{text: personalQuestions[2]}],
                            [{text: mainMenu[2]}]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "1") {
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: true,
                    lastText: userState.lastText + "the sexuality is " + (text === "مرد | male" ? "male" : (text === "زن | female" ? "female" : text)) + " ",
                    tone: "2"
                });
                let objectArrayKeyboard = []
                for (let i = 20; i < 180; i++) {
                    objectArrayKeyboard[objectArrayKeyboard.length] = [{text: i + " kilo gram"}];
                }
                objectArrayKeyboard[objectArrayKeyboard.length] = [{text: mainMenu[2]}]
                await bot.sendMessage(chatId, personalQuestions[3], {
                    reply_markup: {
                        keyboard: objectArrayKeyboard,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "2") {
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: true,
                    lastText: userState.lastText + "the weight is " + text + " ",
                    tone: "3"
                });
                let possibleHeight = [];
                for (let i = 30; i < 230; i++) {
                    possibleHeight[possibleHeight.length] = [{text: i + " cm"}];
                }
                possibleHeight[possibleHeight.length] = [{text: mainMenu[2]}];
                await bot.sendMessage(chatId, personalQuestions[4], {
                    reply_markup: {
                        keyboard: possibleHeight,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "3") {
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: true,
                    lastText: userState.lastText + "the height is " + text + " ",
                    tone: "4"
                });

                // levelOfActivity
                await bot.sendMessage(chatId, levelOfActivity[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: levelOfActivity[1]}],
                            [{text: levelOfActivity[2]}],
                            [{text: levelOfActivity[3]}],
                            [{text: mainMenu[2]}],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else if (userState.tone === "4") {
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: true,
                    lastText: userState.lastText + " the level of activity is " +
                        (text === "تازه کار هستید | newcomer" ? "newcomer" :
                            (text === "سطح متوسطی دارید | Moderate activity level" ? "moderate activity level" :
                                (text === "ورزشکار حرفه ای هستید | your professional athlete" ? "I'm a professional athlete" : text))),
                    tone: "5"
                });
                await bot.sendMessage(chatId, goalOfActivity[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: goalOfActivity[1]}],
                            [{text: goalOfActivity[2]}],
                            [{text: goalOfActivity[3]}],
                            [{text: mainMenu[2]}],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
            } else if (userState.tone === "5") {
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: true,
                    lastText: userState.lastText + " the goal of activity is " +
                        (text === "وزن کم کنید | lower your weight" ? "lower my weight" :
                            (text === "عضله سازی کنید | build muscle" ? "building muscles" :
                                (text === "استقامت خود را افزایش دهید | Increase your stamina" ? "Increase my stamina" : text))) + " ",
                    tone: "6"
                });
                let hoursActivity = [];
                for (let i = 1; i < 40; i++) {
                    hoursActivity[hoursActivity.length] = [{text: i + "hours"}]
                }
                hoursActivity[hoursActivity.length] = [{text: mainMenu[2]}];

                await bot.sendMessage(chatId, hours, {
                    reply_markup: {
                        keyboard: hoursActivity,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
            } else if (userState.tone === "6") {
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: true,
                    lastText: userState.lastText + " The amount of time I can devote to sports is " + text + " per week ",
                    tone: "7"
                });
                // sportClub
                await bot.sendMessage(chatId, sportClub[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: sportClub[1]}],
                            [{text: sportClub[2]}],
                            [{text: mainMenu[2]}],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
            } else if (userState.tone === "7") {
                console.log(userState);
                // "باشگاه میروم | i can go to gym", "در خانه تمرین میکنم | I prefer workout at home"
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: true,
                    lastText: userState.lastText + " and " + (
                        text === "در خانه تمرین میکنم | I prefer workout at home" ? "I prefer workout at home" :
                            text === "باشگاه میروم | i can go to gym" ? "I can go to gym" :
                                text) + " ",
                    tone: "8"
                });
                // disability
                await bot.sendMessage(chatId, disability[0], {
                    reply_markup: {
                        keyboard: [
                            [{text: disability[1]}],
                            [{text: disability[2]}],
                            [{text: mainMenu[2]}],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
            } else if (userState.tone === "8") {
                if (text === disability[2]) {
                    userStates.set(chatId, {
                        ...userState,
                        isRequestingSportProgram: false,
                        lastText: userState.lastText + "and I don't have any physical problem or disability",
                        tone: "",
                        finalRequest: true,
                    });
                    await bot.sendMessage(chatId, "بریم که بسازیم برنامه ورزشیت رو \n lets go create your program", {
                        reply_markup: {
                            keyboard: [
                                [{text: "بزن بریم | lets go"}],
                                [{text: mainMenu[2]}],
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    })
                } else if (text === disability[1]) {
                    userStates.set(chatId, {
                        ...userState,
                        isRequestingSportProgram: true,
                        tone: "9",
                    });
                    await bot.sendMessage(chatId, "لطفا مشکل خود را بنویسید | please explain your problem");
                }
            } else if (userState.tone === "9") {
                userStates.set(chatId, {
                    ...userState,
                    isRequestingSportProgram: false,
                    lastText: userState.lastText + "and I have this problem" + text,
                    tone: "",
                    finalRequest: true,
                });
                await bot.sendMessage(chatId, "بریم که بسازیم برنامه ورزشیت رو \n lets go create your program", {
                    reply_markup: {
                        keyboard: [
                            [{text: "بزن بریم | lets go"}],
                            [{text: mainMenu[2]}],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
            }
        } else if (userState.finalRequest) {
            await bot.sendMessage(chatId, "در حال ساختن برنامه ورزشی اختصاصی شما هستیم | we are creating your workout schedule");
            await bot.sendMessage(chatId, "🏀");
            const promptText = `I'm seeking a comprehensive weekly workout schedule tailored to my needs. Here's what I'm looking for:

Weekly Schedule Overview: Start with a brief overview of the weekly plan, including workout days and rest days.
Detailed Daily Workouts:
For each exercise, include a direct YouTube link for a visual guide.
Provide full instructions and explanations on how to perform each move correctly, focusing on form and safety.
Offer alternatives for each exercise, categorizing them as primary, secondary, and isolated movements. Explain how to execute these alternatives in simple terms.
Specify the recommended sets, reps, and rest periods for optimal results. Include any special instructions on tempo or technique to enhance effectiveness and minimize injury risks.
Warm-Up and Cool-Down Routines: Recommend specific pre-workout warm-ups and post-workout cool-downs to prepare the body and aid in recovery.
Personalization: I will provide you my information and my goal and my limits here : ` +
                userState.lastText;
            const object = {
                message: promptText,
                idChat: chatId
            };
            await handleBotLogic(bot, chatId, object);
            // finalRequest
            await userStates.set(chatId, {
                ...userState,
                finalRequest: false
            });

            // await axios.post('http://localhost:3001/gpt4', object)
            //     .then((res) => {
            //         console.log(res.data);
            //         bot.sendMessage(chatId, res.data)
            //             .then(() => {
            //                 return bot.sendMessage(chatId, "چند دقیقه صب کنی نسخه فارسیش رو هم بهت تحویل میدم|please wait for the persian result");
            //             })
            //             .then(() => {
            //                 return bot.sendMessage(chatId, "😉");
            //             })
            //         const object2 = {
            //             message: "اینو به فارسی ترجمه کن با اما سعی کن اصطلاحات انگلیسی را حفظ کنی" + res.data,
            //             idChat: chatId
            //         }
            //         axios.post('http://localhost:3001/gpt4', object2)
            //             .then((res) => {
            //                 console.log(res.data);
            //                 bot.sendMessage(chatId, res.data);
            //                 sendCustomMessage(bot, chatId);
            //             })
            //             .catch((error) => {
            //                 console.error('Error sending data to server:', error);
            //             });
            //     })
            //     .catch((error) => {
            //         console.error('Error sending data to server:', error);
            //     });
        } else if (text === optionBloodTest[0]) {
            userStates.set(chatId, {
                ...userState,
                IsRequestingBloodTest: true
            });
        } else if (text === optionBloodTest[1]) {


            try {
                let res = await axios.get('http://localhost:3001/isUserValid?idChat=' + chatId);
                if (res.data.message === "its valid") {
                    console.log("The user has subscription");


                    await bot.sendMessage(chatId, dualLanguageResult);
                    const object = {
                        text: promptBloodTest,
                        images: userState.photos,
                        idChat: chatId
                    };
                    axios.post('http://localhost:3001/gpt4plus', object)
                        .then((res) => {
                            console.log(res.data);
                            bot.sendMessage(chatId, bloodTestPersianAndEnglishAlert[0])
                                .then(() => {
                                    return bot.sendMessage(chatId, res.data.choices[0].message.content);
                                })
                                .then(() => {
                                    return bot.sendMessage(chatId, bloodTestPersianAndEnglishAlert[1]);
                                })
                                .then(() => {
                                    return bot.sendMessage(chatId, '🤓');
                                })
                                .catch((error) => {
                                    console.error('Error sending messages:', error);
                                });


                            let object2 = {
                                text: res.data.choices[0].message.content,
                                destinationLanguage: "Persian",
                                idChat: chatId
                            }
                            axios.post('http://localhost:3001/translateApiLanguage', object2)
                                .then((res) => {
                                    console.log(res.data);
                                    bot.sendMessage(chatId, bloodTestPersianAndEnglishAlert[2])
                                        .then(() => {
                                            return bot.sendMessage(chatId, res.data);
                                        })
                                        .then(() => {
                                            return sendCustomMessage(bot, chatId);
                                        })
                                        .catch((error) => {
                                            console.error('Error sending messages:', error);
                                        });
                                    userStates.set(chatId, {
                                        ...userState,
                                        photos: []
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error sending data to server:', error);
                                });
                        })
                        .catch((error) => {
                            console.error('Error sending data to server:', error);
                        });
                } else {
                    await bot.sendMessage(chatId, "متاسفانه شارژ حساب کاربری شما تمام شده یا شارژ کنید یا از دوستانتان دعوت کنید \n your account need charge please charge it or invite your friends", {
                        reply_markup: {
                            keyboard: [
                                [{text: messageChargeOption1}],
                                [{text: messageChargeByInvite}],
                                [{text: mainMenu[2]}],
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                await bot.sendMessage(chatId, "Sorry, there was an error processing your request.");
            }

        } else if (text === tellMeHowToDoIt[1]) {
            await bot.sendMessage(chatId, tellMeHowToDoIt[2]);
            await bot.sendMessage(chatId, tellMeHowToDoIt[3]);
            userStates.set(chatId, {
                ...userState,
                requestExplainingSportMove: true
            });
        } else if (userState.requestExplainingSportMove) {
            await bot.sendMessage(chatId, tellMeHowToDoIt[4]);
            await bot.sendMessage(chatId, '🫡');
            // freeGpt35


            const object35 = {
                message: 'بهم نحوه دقیق اجرای این حرکت ورزشی را با ریز ترین جزیات و به ساده ترین روش ممکن به دو زبان انگلییسی و فارسی توضیح بده حرکت مورد نظر من {' + text + '}',
                idChat: chatId
            };

            axios.post('http://localhost:3001/gpt4', object35)
                .then((res) => {
                    console.log(res.data);
                    bot.sendMessage(chatId, res.data, {parse_mode: "Markdown"});
                    sendCustomMessage(bot, chatId);
                })
                .catch((error) => {
                    console.error('Error sending data to server:', error);
                });

        } else if (text === 'حساب کاربری شما📖✏|📖✏your profile') {
            console.log("here");
            let textProfile = "";
            try {
                const url = 'http://localhost:3001/messages?idChat=' + chatId;
                const response = await axios.get(url);
                console.log(response.data[0]);
                let ProteinTeam = response.data[0].name; // Assuming this is how you get the team's name


                textProfile = `سلام ${ProteinTeam} عزیز

وضعیت اشتراک های شما در محصولات پروتئین:
🟣 تعداد دفعات مجاز برای استفاده از ربات سرپایی💉 : ${response.data[0].tokenBloodTest} بار

🟢 تعداد دفعات مجاز برای استفاده از ربات کوردرا 🌉 : ${response.data[0].tokenDallE} بار @AiImageLogoCreator_bot 

🔵 تعداد دفعات مجاز برای استفاده از ربات درگوشی🖋 : ${response.data[0].tokenTextGenerator} بار @chatterproteinai_bot 

🟠 تعداد دفعات مجاز برای استفاده از ربات فیلم یاب🎥 : ${response.data[0].tokenFilmYab} بار

🔴 تعداد دفعات مجاز برای استفاده از ربات ریاضی دان🎒 : ${response.data[0].tokenMath} بار

🔶 موجودی حساب کاربری شما💰💸 : 🟣 تعداد دفعات مجاز برای استفاده از ربات دکتر و ازمایش خوان💉 : ${response.data[0].universalWallet} تومان

📣 اگر دوست داری کلی از ربات کوردرا، رایگان استفاده کنی فقط کافیه 2 نفر از دوستانت را عضو کنی🤩🔥

Dear ${ProteinTeam},

Here's the status of your subscriptions for Protein products:

🟣 Allowed uses for the outpatient Bot 💉: ${response.data[0].tokenBloodTest} times

🟢 Allowed uses for Cordraw Bot 🌉: ${response.data[0].tokenDallE} times @AiImageLogoCreator_bot

🔵 Allowed uses for Chatter Bot 🖋: ${response.data[0].tokenTextGenerator} times  @chatterproteinai_bot

🟠 Allowed uses for the Film Finder Bot 🎥: ${response.data[0].tokenFilmYab} times

🔴 Allowed uses for the Math Wizard Bot 🎒: ${response.data[0].tokenMath} times

🔶 Your account balance 💰💸: ${response.data[0].universalWallet} Euros

📣 If you'd like to use all of Protein Bots for free, just invite 2 friends to join!🔥🤩`;


                await bot.sendMessage(chatId, textProfile, {
                    reply_markup: {
                        keyboard: [
                            [{text: messageChargeOption1}],
                            [{text: messageChargeByInvite}],
                            [{text: mainMenu[2]}],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                await bot.sendMessage(chatId, 'خطا پیش آمده ');
            }
        } else if (text === messageChargeOption1) {
            await bot.sendMessage(chatId, plansMessage);
            await sendCustomMessage(bot, chatId);
        }  else if (text === messageChargeByInvite) {
            let inviteCompletedOrNot = false;
            try {
                await axios.get('http://localhost:3001/inviteBlood?idChat=' + msg.from.id);
                inviteCompletedOrNot = true;
                console.log("checkCompleted");
            } catch (error) {
                console.log("WEEEEEEEEEEEEEEEE");
                console.error('Error sending data to server:', error);
            }
            if (inviteCompletedOrNot) {
                await bot.sendMessage(chatId, successInvite);
                await sendCustomMessage(bot, chatId);
            } else {
                await bot.sendMessage(chatId, inviteAlert);
                const referralLink = `https://t.me/outPtient_bot?start=${msg.from.id}`;
                // Send the referral link with the message in Persian
                await bot.sendMessage(chatId, `از دوستانت دعوت کن: ${referralLink}` + "\ninvite your friends with this link");
                await sendCustomMessage(bot, chatId);
            }
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
                isMakingDiet: false,
                isInvitingFriend: false,
                orderingRecipe: false,
                isRequestingSportProgram: false,
                finalRequest: false,
                requestExplainingSportMove: false,
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
        } else if (text === recipe) {
            await bot.sendMessage(chatId, '🍟');
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
            await bot.sendMessage(chatId, "لطفاکمی صبور باشید تا رسپی غذا شما پخته شود\nplease be patient till the recipe cook");
            const object = {
                message: `رسپی این غذا را هم به فارسی هم به انگلیسی به اندازه یک نفر بنویس و به صورت کامل و ریز به ریز توضیح بده :غدا مورد نظر [${text}]`,
                idChat: chatId
            };

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
        } else if (text === changeFood) {

        } else {
        }
    }
)
;


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
                [{text: createSportProgram}],
                [{text: tellMeHowToDoIt[1]}],
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

function splitLongText(text, maxLength = 4096) {
    let parts = [];
    while (text.length > 0) {
        let part = text.substring(0, maxLength);
        parts.push(part);
        text = text.substring(maxLength);
    }
    return parts;
}

// Function to send long messages in parts
async function sendLongMessage(bot, chatId, message) {
    const parts = splitLongText(message);
    for (let part of parts) {
        await bot.sendMessage(chatId, part, {parse_mode: "Markdown"});
    }
}

// Example async function to handle the logic
async function handleBotLogic(bot, chatId, object) {

    try {
        let res = await axios.get('http://localhost:3001/isUserValid?idChat=' + chatId);
        if (res.data.message === "its valid") {
            console.log("The user has subscription");
            try {
                // Send request to your API and get the initial response
                let res = await axios.post('http://localhost:3001/gpt4', object);
                console.log(res.data);

                // Send the initial long response
                await sendLongMessage(bot, chatId, res.data);
                await bot.sendMessage(chatId, tellMeHowToDoIt[0]);


                // Notify user about waiting for the Persian translation
                await bot.sendMessage(chatId, "چند دقیقه صبر کنید نسخه فارسیش رو هم بهت تحویل میدم\nplease wait for the Persian result");
                await bot.sendMessage(chatId, "😉");

                // Prepare and send the request for translation
                const object2 = {
                    message: "اینو به فارسی ترجمه کن با اما سعی کن اصطلاحات انگلیسی را حفظ کنی" + res.data,
                    idChat: chatId
                };
                res = await axios.post('http://localhost:3001/gpt4', object2);
                console.log(res.data);
                await bot.sendMessage(chatId, tellMeHowToDoIt[0]);

                // Send the translated response
                await sendLongMessage(bot, chatId, res.data);
                await sendCustomMessage(bot, chatId);
            } catch (error) {
                console.error('Error:', error);
                await bot.sendMessage(chatId, "Sorry, there was an error processing your request.");
            }

        } else {
            await bot.sendMessage(chatId, "متاسفانه شارژ حساب کاربری شما تمام شده یا شارژ کنید یا از دوستانتان دعوت کنید \n your account need charge please charge it or invite your friends", {
                reply_markup: {
                    keyboard: [
                        [{text: messageChargeOption1}],
                        [{text: messageChargeByInvite}],
                        [{text: mainMenu[2]}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        await bot.sendMessage(chatId, "Sorry, there was an error processing your request.");
    }

}


async function handleBotLogicDiet(bot, chatId, object) {
    try {
        let res = await axios.get('http://localhost:3001/isUserValid?idChat=' + chatId);
        if (res.data.message === "its valid") {
            console.log("The user has subscription");

            try {
                // Send request to your API and get the initial response
                let res = await axios.post('http://localhost:3001/gpt4Low', object);
                console.log(res.data);

                // Send the initial long response
                await sendLongMessage(bot, chatId, res.data);


                // Notify user about waiting for the Persian translation
                await bot.sendMessage(chatId, "چند دقیقه صبر کنید نسخه فارسیش رو هم بهت تحویل میدم\nplease wait for the Persian result");
                await bot.sendMessage(chatId, "😉");

                // Prepare and send the request for translation
                const object2 = {
                    message: "این متن رو به صورت دقیق و کامل به فارسی ترجمه کن بدون این که قسمتی جا به ماند خیلی مهم است که به صورت کامل ترجمه شود" + "[" + res.data + "]",
                    idChat: chatId
                };
                res = await axios.post('http://localhost:3001/gpt4Low', object2);
                console.log(res.data);
                await bot.sendMessage(chatId, tellMeHowToDoIt[0]);

                // Send the translated response
                await sendLongMessage(bot, chatId, res.data);
                await sendCustomMessage(bot, chatId);
            } catch (error) {
                console.error('Error:', error);
                await bot.sendMessage(chatId, "Sorry, there was an error processing your request.");
            }

        } else {
            await bot.sendMessage(chatId, "متاسفانه شارژ حساب کاربری شما تمام شده یا شارژ کنید یا از دوستانتان دعوت کنید \n your account need charge please charge it or invite your friends", {
                reply_markup: {
                    keyboard: [
                        [{text: messageChargeOption1}],
                        [{text: messageChargeByInvite}],
                        [{text: mainMenu[2]}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        await bot.sendMessage(chatId, "Sorry, there was an error processing your request.");
    }
}

