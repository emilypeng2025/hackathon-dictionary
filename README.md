# Dictionary + Hebrew App

## Description
A web application that allows users to search for English words and Hebrew words (translated into English), view definitions, and save flashcards.

## Features
- English dictionary search
- Hebrew translation support
- Search history
- Flashcards
- LocalStorage persistence

## Tech Stack
- TypeScript
- Fetch API
- DOM Manipulation
- LocalStorage

## Status
Day 1: UI + mock data complete (Free Dictionary API)

<!-- notes for ourselves 现在就能开始做的，不会增加太多工作：
	1.	做好错误处理
	2.	不暴露 API key
    3.	不依赖单一结果，尽量显示多个定义
        只显示前 3 个 meanings 或 definitions， 每个结果有一个 Save button
            （以后要做的：告诉用户：这个定义来自哪个 source，是 dictionary result 还是 tech glossary， 目前先只做 General Dictionary， 先做“source selector”以后可以有General Dictionary， Tech Terms， 也可以自己做一个小型techTerms.json：
                        [
            {
                "word": "python",
                "definition": "A popular programming language used for web, data, and AI."
            },
            {
                "word": "api",
                "definition": "A way for programs to communicate with each other."
            }
            ]
            ）这个非常适合 hackathon，因为：•	简单 •	可控 •	不依赖别的网 •	很适合 demo
            而且你自己以后真的可以拿来学编程。
	4.	输入做基本验证（就是先检查用户输入是不是合理，再去查 API，避免空白、奇怪字符、超长内容导致报错或体验差。）
	5.	数据结构设计稍微清楚一点，方便以后扩展 什么叫“清楚的数据结构”？应该尽量存成 object： {
        word: "hello",
        phonetic: "həˈləʊ",
        partOfSpeech: "exclamation",
        definition: "used as a greeting or to begin a phone conversation.",
        example: "hello there, Katie!"
            } 
        对 search history 也是一样 [
            {
                word: "hello",
                searchedAt: "2026-04-02T10:30:00"
            },
            {
                word: "python",
                searchedAt: "2026-04-02T10:32:00"
            }
            ]这样以后你可以：
            •	按时间排序
            •	显示最近搜索
            •	去重
            •	统计最常搜的词
        对 flashcards 更明显，保存时就最好存成：
            {
            word: "python",
            phonetic: "...",
            partOfSpeech: "noun",
            definition: "A high-level programming language.",
            example: "Python is widely used in AI.",
            source: "tech-glossary"
            }
        so，search result，从 API 拿到结果后，先整理成你自己的统一格式。
        const cardData = {
            word: foundWord,
            phonetic: phonetic,
            partOfSpeech: partOfSpeech,
            definition: definition,
            example: example
        }; 
        然后：
            •	render 用这个 object
            •	save flashcard 也用这个 object
            -->