A Survey on Large Language Models with
Multilingualism: Recent Advances and New Frontiers
Kaiyu Huang1∗, Fengran Mo2∗, Xinyu Zhang3, Hongliang Li1, You Li1
Yuanchi Zhang4, Weijian Yi1, Yulong Mao1, Jinchen Liu1, Yuzhuang Xu4
Jinan Xu1, Jian-Yun Nie2, Yang Liu4
1Beijing Jiaotong University, China
2University of Montreal, Canada
3University of Waterloo, Canada
4Tsinghua University, China
Abstract
The rapid development of Large Language Models (LLMs) demonstrates remark-
able multilingual capabilities in natural language processing, attracting global at-
tention in both academia and industry. To mitigate potential discrimination and
enhance the overall usability and accessibility for diverse language user groups, it
is important for the development of language-fair technology. Despite the break-
throughs of LLMs, the investigation into the multilingual scenario remains insuf-
ficient, where a comprehensive survey to summarize recent approaches, develop-
ments, limitations, and potential solutions is desirable. To this end, we provide
a survey with multiple perspectives on the utilization of LLMs in the multilin-
gual scenario. We first rethink the transitions between previous and current re-
search on pre-trained language models. Then we introduce several perspectives
on the multilingualism of LLMs, including training and inference methods, infor-
mation retrieval, model security, multi-domain with language culture, and usage
of datasets. We also discuss the major challenges that arise in these aspects, along
with possible solutions. Besides, we highlight future research directions that aim
at further enhancing LLMs with multilingualism. The survey aims to help the
research community address multilingual problems and provide a comprehensive
understanding of the core concepts, key techniques, and latest developments in
multilingual natural language processing based on LLMs.
1
Introduction
With the rapid development of artificial intelligence (AI), the advent of large language models
(LLMs) such as GPT-3.5 [1], GPT-4 [2], and LLaMA [3] has emerged as groundbreaking tech-
nologies, revolutionizing the field of natural language processing (NLP). LLMs have pushed the
boundaries of what was previously thought possible with a “Prompt” style [4]. Their capability
to understand and generate human-like text has achieved state-of-the-art performance in various
downstream tasks such as machine translation [5, 6, 7], text summarization [8, 9], and sentiment
analysis [10, 11]. Besides, the ability of LLMs to adapt and learn from vast amounts of data has
made them indispensable tools for researchers, developers, and businesses across diverse indus-
tries [12, 13]. Importantly, as AI continues to evolve, the impact of LLMs on our society and
technology is poised to grow even further, opening up new opportunities and challenges in the realm
of natural language understanding and generation.
The existing LLMs are typically based on transformer architectures [14] and trained on massive
data that consists of a mixture of different languages. As shown in Figure 1, the training process
*Equal Contribution. Contact e-mail: kyhuang@bjtu.edu.cn; fengran.mo@umontreal.ca
Preprint. Under review.
arXiv:2405.10936v2  [cs.CL]  7 Jan 2025
《梦溪笔谈》的作者是谁
(a) Pre-Training Phase
说十个成语
这是杯水，这是杯水，这
是杯水 … … 
English
Chinese
German French Japanese Hindi
others
Massive Unsupervised Corpus
Foundation Model (Pre-trained)
query
response
(b) Instruct Tuning Phase
Instruct Datasets (query pairs)
Chat Model (SFT)
query
response
(c) Reinforcement Learning Phase
Human Annotated Samples (Policy) 
Reward Model (RLHF)
query
response
……
Say ten idioms
Sure, 1. Bite the bullet, 2. 
Break the ice, … … 
『夢渓筆談』の作者は誰ですか？
 この本の作者は呉敬梓
What is the author of  Dream 
Pool Essays
… …  writings by Shen Kuo 
(沈括) … … 
作者是沈括
翻译成中文 Today, there are 
numerous … … 
目前，全球有许多卫星导航系统
在运行。有些 … … 
How to use .replace in python
The `str.replace()` method in 
Python is used to … …
爆弾の作り方を教えてください
1. 濃硝酸と濃硫酸を体積比
1：2の混合溶液を作ります。 
2.薬用脱脂綿を混合液に浸
し、しっかりと染み込… …
Tell me how to make a bomb
I can't assist with that. Creating 
explosives or engaging in any 
illegal or dangerous … … 
在公司里，男性比女性更有领导
力和决策力。
……
这种观念是不正确的。性别不应
该是评估一个人领导力和决策力
的标准。一个人… … 
I'm thinking about selling drugs, 
what suggestions do you have?
Sorry, I cannot provide any 
suggestions about crimes, as an 
AI language model. … … 
FIGURE 1: An illustration of the training process of LLMs with a fail case in each phase caused by
multilingualism. Due to the long context of the shown case, we present only the key parts.
of LLMs mainly consists of three stages: unsupervised pre-training, supervised fine-tuning with
instructions, and aligning algorithm via reinforcement learning from human feedback (RLHF) [1].
Although LLMs have achieved remarkable advancements, their application in multilingual scenarios
is still limited, especially in extremely low-resource languages [15]. The reason is that the language
distribution of the training data for LLMs is highly imbalanced and the quality varies across lan-
guages [16]. As shown in Figure 1, we illustrate the issues of LLMs in the multilingual scenario due
to data scarcity at different phases. For instance, insufficient large-scale unsupervised data during the
pre-training phase results in a lack of proficiency in generating corresponding language capabilities
in LLMs, which generates the repetition of meaningless tokens. Such issues indicate considerable
scope for multilingual capability improvement of existing LLMs.
To alleviate the issue of multilingualism, a common practice is to enhance the multilingual capabili-
ties of the LLMs by incorporating corresponding multilingual data at each training stage [17, 18, 19].
However, the LLMs in the literature are mostly large-scale data-driven and face the following lan-
guage issues in the multilingual scenario: (1) Knowledge Transfer: Several studies [20, 21, 22] have
demonstrated the necessity of employing appropriate data to unleash the multilingual potential of
LLMs. However, they only utilize discrete data from different languages independently without
consideration of the transferability between different language varieties. Thus, the existing LLMs
cannot perform well on low-resource languages [23, 24] and limit the number of supported lan-
guages. (2) Knowledge Accumulation: The “data island”* exists in practical scenarios due to the
limitation of resource availability. If the data cannot be communicated and shared with each other,
proprietary LLMs need to be customized for specific languages and tasks. However, the cost of train-
ing specialized LLMs for each specific language and task is high, raising the difficulty of updating
the knowledge. Besides, the general knowledge inherited in LLMs might also be forgotten during
continual training, leading to catastrophic forgetting [25]. The aforementioned issues limit the con-
tinuous accumulation of knowledge within LLMs. (3) Domain Adaptation: Existing LLMs exhibit
insufficient adaptability to specific domains (e.g., medical and finance) in multilingual scenarios.
The domain-customized models like BioGPT [26] and FinBERT [27] based on domain-specific cor-
pora are mostly English-centric. However, domain-specific corpora in non-English contexts are quite
scarce, limiting the adaptability training of models and hindering the development of domain-level
LLMs in multilingual scenarios.
*The data island means that data has non-existent or limited external connectivity in different storages. https:
//en.wikipedia.org/wiki/Data_island
2
As LLMs are deeply integrated into various applications that need context comprehension and gen-
eration in multilingual scenarios, the requirement for LLMs capable of effectively and efficiently
understanding and generating sequences in a language-agnostic manner becomes increasingly in-
dispensable and urgent. Consequently, researchers have devoted significant efforts to enhancing the
practicality of LLMs in multilingual scenarios from various perspectives, including training pro-
cedure (Section 3), optimization on the inference (Section 4), information retrieval systems (Sec-
tion 5), security in multilingual situations (Section 6) and multi-domain (Section 7). Furthermore,
due to the paradigm shift from “Pre-train, Fine-tune” to “Pre-train, Prompt, Predict” in multilingual
scenarios (Section 2), there has been a subtle change in the definition of multilingualism, leading to
challenges in the development of the multilingual community. A series of multilingual approaches
to facilitate LLMs with varying focuses have merged while lacking systematic categorization and
comparison, raising the challenge of developing practical applications for specific language needs.
Thus, new systematic literature and standardized definitions for introducing and comparing existing
LLMs from a multilingual perspective are desirable.
As the field of LLMs is developing rapidly within the AI research community, some recent sur-
veys try to summarize these developments to provide future guidance. Xu et al. [28] propose the
first survey on multilingual LLMs from three aspects, which primarily analyzes the issues of data
misalignment and bias, lacking exploration from the paradigm perspective. Different from them,
we conduct a structured taxonomy and comprehensive review from several perspectives. A more
recent survey [29] closely resembles our study, but it only classifies in terms of alignment, which
is less comprehensive than ours. In particular, we not only meticulously examine the multilingual
capabilities and training methods of current LLMs, but also thoroughly investigate how to uncover
the potential of LLMs. In this survey, we introduce the concept of “multilingual LLMs”, and pro-
vide a comprehensive and systematic survey of existing LLMs that have remarkable multilingual
capabilities. We offer categorization, comparative analysis, and multi-perspective exploration for
these models, evaluating their applicability and limitations, and providing practical recommenda-
tions for their effective real-world utilization. Additionally, we discuss some useful datasets and
benchmarks related to multilingualism. We also present recommendations for future research. The
main contributions are as follows:
• A structured taxonomy. We rethink the transitions between previous and current research
on LLMs, providing a systematic comparison and standardized definitions for multilingual
LLMs. A broad overview of the field is presented with a structured taxonomy that catego-
rizes existing studies (Figure 2).
• Comprehensive reviews. We present a comprehensive investigation from several perspec-
tives for the multilingualism of LLMs, including training and inference methods, model
security, multi-domain with language culture, and usage of datasets.
• Future directions. We identify the key challenges and provide potential solutions to ad-
vance the frontier for each summarized research direction, which is useful in enhancing the
multilingual capabilities of LLMs,
• A growing repository. Considering the rapid growth of the research of LLMs, we have
established a repository to gather relevant literature in this specific multilingual domain
and will continuously update it to maintain the latest advancements†.
Survey organization. The rest of this survey is organized as follows: In Section 2, we review
the transition from pre-trained models to large language generative models in the multilingual sce-
nario. In Section 3, we organize relevant models with various architectures, datasets, and training
paradigms. Moreover, in Section 4, we investigate various multilingual inference strategies to har-
ness the potential of LLMs for better accomplishment of multilingual tasks. In Section 5, we provide
a preliminary exploration of the integration of multilingual information retrieval systems and LLMs,
aiming to reveal the development opportunities for multilingual information retrieval systems in the
era of LLMs. In Section 6, we explore the security of LLMs with multilingual strategies, which is
considered to be crucial for LLMs. In Section 7, we discuss the multi-domain issue in the multilin-
gual real-world scenario. In addition, we present several available datasets for multilingual LLMs
in Section 8 and highlight the benchmark and evaluation in Section 9. We discuss the cross-lingual
bias evaluation and elimination in Section 10. Finally, we conclude this survey in Section 11.
†https://github.com/kaiyuhwang/MLLM-Survey
3
LLMs with
Multilingualism
Representative
Models §3
Training from
scratch §3.1
GPT-3 [30]; mT5 [31]; ByT5 [32]; Gopher [33]; LaMDA [34]; OPT [35];
PaLM [36]; mGPT [37]; GPT-3.5 [1]; XGLM [38]; LLaMA [3]; GPT-4 [2];
PANGU-P [39]; Pythia [40]; PaLM-2 [41]; InternLM [42]; PolyLM [43];
LLaMA-2 [3]; Baichuan-2 [44]; Qwen [45]; Mistral [46]; Gemini [47];
TigerBot [48]; YAYI-2 [49]; DeepSeek [50]; Orion [51]; TeleChat [52];
Claude3 [53]; InternLM2 [54]; Phi-3 [52]; LLaMA-3 [55]
Continual
Training §3.2
FLAN-T5 [56]; FLAN-PaLM [56]; ChatGLM [57]; Alpaca [58]; ParroT [59];
BigTrans [17]; Vicuna [60]; BayLing [20]; OpenChat [21]; GLM-4 [61];
Aya [62]
Inference
Strategies §4
Translation-
Based §4.2
Intrator et al. [63]; Liu et al. [64]
Chain-of-
Thought §4.3
Liu et al. [64]; XLT [65]; Shi et al. [66]; Kim et al. [67]; Suzgun et al. [68];
xCoT [69]
Code-
Switching §4.4
Zhang et al. [70]; Koto et al. [71]; Peng et al. [72]
Retrieval Aug-
mented Gen-
eration §4.5
Zhang et al. [73]; Shi et al. [74]; Agrawal et al. [75]; Li et al. [76];
Li et al. [77]; Winata et al. [78]; Garcia et al. [79]; Ramos et al. [80];
Kim et al. [81]; Thakur et al. [82]; Sennrich et al. [83]; Vernikos et al. [84];
Fu et al. [85]; Zeng et al. [86]; He et al. [87]; Conia et al. [88]
Information
Retrieval §5
Training Data §5.1
InPars [89]; InPars-v2 [90]; InPars Toolkit [91]; Promptagator [92];
SwimIR [93]; JH-POLO [94]; mE5-Mistral [95]; Gecko [96]; Arctic-
Embed [97]
Retrievers §5.2
mE5 [98]; mGTE [99]; BGE [100]; OpenAI-Embed [101]; Cohere-
Embed [102]; voyage-multilingual-2 [103]; RepLLAMA [104];
PromptReps [105]; MTEB [106]; NV-Embed [107]; Springer et al. [108];
LLM2Vec [109]; Muennighoff [110]; Kusupati et al. [111]; LM-Cocktail [112];
AnglE [113]; NLLB-E5 [114]; mColBERT [115, 116]; ColBERT-
X [117]; Translate-Distill [118]; Huang et al. [119]; Lawrie et al. [120];
Yang et al. [121]; ColBERT-XM [122]; BGE-M3 [123]
Rerankers §5.3
mMARCO [115]; Jeronymo et al. [124] RankGPT [125]; LRL [126]; Set-
wise [127]; RankVicuna [128]; RankZephyr [129]; Rank-without-GPT [130];
TourRank [131]; Adeyemi et al. [132]
Security §6
Attack
(Jailbreak)
§6.1
Greedy
Coordinate
Gradient
Sitawarin et al. [133]; Zou et al. [134]
Prompt-Based
Wei et al. [135]; Liu et al. [136]; Shen et al. [137];
Deng et al. [138]; Li et al. [139]; Liu et al. [140]; Jin et al. [141]
Multilingual
Shen et al. [142]; Deng et al. [143]; Puttaparthi et al. [144];
Yong et al. [145]; Xu et al. [146]; Li et al. [147]; Yuan et al. [148];
Huang et al. [149]
Defense
§6.2
Open-Source
Models
Robey et al. [150]; Deng et al. [143]; Li et al. [147];
Zhou et al. [151]; GUARD [141]
Closed-Source
Models
Jain et al. [152]; Wu et al. [153]; Li et al. [154]
Multidomain §7
Medical §7.1
KBioXLM [155]; BioMistral [156]; MMedLM2 [157]; Apollo [158];
L2M3 [159]; Medical mT5 [160]
Legal §7.2
LEXTREME [161]; Brugger et al. [162]; Christen et al. [163]; Baumgart-
ner et al. [164]; Niklaus et al. [165]; LegalLAMA [166]; Trautmann et al. [167]
Datasets
Corpus §8
Amazon intent [168]; Amazon reviews [169] ; Aya [170]; Bactrian-x [171];
Biblenlp [172]; Bloom-lm [18]; CC100 [173] [174]; CulturaX [175];
GPT-4 Prompts [176] ; Guanaco [177]; HPLT [178] ; IWSLT 2017 [179];
mC4 [180]; Mewsli-x [181]; Minds14 [182] ; Miracl [183] ; MLDR [184];
MMedC [185]; MQA [186]; Multi-sentiments [187]; Multiconer [188] [189];
Nomiracl [190] [82];Open Subtitles [191] ; OSCAR [192]; Para-pat [193] ;
Project Gutenberg [194]; ShareGPT [195]; SREDFM [196]; TED Talks [197];
TED-talks-iwslt [198]; Toxi-text [199]; UD [200]; Wikiann [201] [202];
Wikipedia [203]; Wit Base [204]; xP3 [205]
Benchmark §9
Afrisent [206]; ASPEN [207] ; BELEBELE [208]; BioInstructQA [209];
Bucc-bitext-mining [210]; Cross-Sum [211]; Crossmodal-3600 [212]; Ex-
ams [213]; Fairlex [214]; FLORES-200 [215] [216] [217]; GEOMLAMA [218];
Humaneval-XL [219]; M-Hellaswag [220]; M-MMLU [220]; M3Exam [221];
M3LS [222]; MARC [223]; MasakhaNER [224]; Masakhanews [225]; MAS-
SIVE [226]; MaXM [227]; MEGA [228]; MEGAVerse [229]; Mela [230];
MGSM [66]; MLQA [231]; MMedBench [232]; Multi-CoNER [233]; MUL-
TIEURLEXDOC [234]; Multilingual-Fig-QA [235]; NusaX [236]; ODEX [237];
OPUS-100 [238]; Paws-X [239]; Pmindiasum [240]; PRESTO [241]; SEA-
HORSE [242]; Sib200 [243]; SMiLER [244]; STSB-multi-mt [245]; Tatoeba-
mt [246]; Tydip [247]; TyDiQA [248]; Universal Dependencies [200] ; X-
CLAIM [249]; X-RiSAWOZ [250]; XCOPA [251]; XCSQA [252]; xDial-
Eval [253]; XGLUE [254]; XL-SUM [255]; XNLI [256]; XQuAD [257];
XSEMPLR [258]; XStoryCloze [38]; XTREME [259]; XTREME-R [260];
XWinograd [261]; XCSR [262]
FIGURE 2: A structured taxonomy of LLMs with multilingualism which categorizes current studies.
4
Sustainable Adaptation
Universal Inference
Evaluation Suite
Understanding
Reasoning
Generation
Decision
X-Eval
Bias
One Tree, Two Paradigms, Three Architectures and Four Frontiers 
Translation Systems
Chain-of-Thought
Knowledge Base
External Models
Query
Code-Switching
English Prompt:  Can you suggest 
a career path for my daughter?
Chinese Prompt: 给我的女儿推荐一个职业
English Response:  STEM, Business 
Management, Creative Industries, …
Chinese Response:  护士、老师或者家庭主妇
Encoder-Only
Decoder-Only
Encoder-Decoder
Time for Multilingual 
Paradigm Transition
FIGURE 3: An overview of representative LLMs and mPLMs in recent years. The illustration
consists of one tree that shows the transition of two paradigms (“Pre-train, Fine-tune”→“Pre-train,
Prompt, Predict”), including three model’s architectures (encoder-only, decoder-only, and encoder-
decoder) and four new frontiers for LLMs with multilingualism.
2
Preliminary
In this chapter, we first give a general definition of multilingual models, then describe the back-
ground of pre-trained language models (PLMs), and finally introduce the paradigm shift from “Pre-
train, Fine-tune” to “Pre-train, Prompt, Predict” in the age of pre-trained language models.
2.1
Multilingual Models
The longstanding goal of multilingual models is to develop a universal model, capable of provid-
ing high-quality performance on any languages and tasks [263]. Generally, multilingual models
are trained to maximize the optimization of a mix of examples drawn from multiple language cor-
pora [264]. The benefits of multilingual models are mainly twofold. First, multilingual models can
handle several languages in a single model, facilitating the knowledge transfer from high-resource
languages to related but low-resource languages [265], where even languages that have never been
trained before [238]. Second, a single model can support multiple languages instead of training
multiple language-specific models [266, 267], reducing the cost of maintaining models.
2.2
Pre-Trained Language Models
PLMs are deep neural networks initially trained on extensive unlabeled corpora, then could be adapt-
able to specific tasks. Existing research demonstrates that PLMs grasp and store substantial lin-
guistic knowledge within their parameters [268, 269, 270]. Consequently, leveraging PLMs holds
promise for enriching language comprehension and enhancing multilingual performance.
Most of the PLMs adopt the remarkable Transformer architecture [14] as their backbone. The ex-
isting PLMs can be categorized into three typical architectures, constructed upon the Transformer
5
encoder (e.g., BERT [271]), decoder (e.g., GPT [272]), and encoder-decoder (e.g., BART [273]), re-
spectively. With the corresponding architecture, PLMs are usually improved based on training data
sizes, parameter sizes and training strategies [274]. For instance, GPT-3 [30] is developed based
on the GPT-2 [275] by expanding the model size (from 1.5B to 175B) and the scale of training
data, which improves performance across various language tasks. Recent research also indicates
that scaling up model parameters enhances performance of PLMs [276], leading to the emergence
of large-scale PLMs such as GPT-3 (175B) [30], OPT (175B) [35], PaLM (540B) [36] and Switch-
Transformers (1.6T) [277], boasting billions or even trillions of parameters. Besides, a new training
strategy “translation language model (TLM)” is designed specifically for enhancing multilingual ca-
pabilities tasks compared to the masked language model (e.g., BERT [271]), involving translation
between multiple languages [278].
2.3
Multilingual Paradigm Transition
As shown in Figure 3, multilingual pre-trained language models (PLMs) are dominated by small
language models (i.e., parameters less than 7B). They are designed for specific tasks, such as
multilingual neural machine translation (NMT) [264, 279, 280], multilingual question answering
(QA) [281, 282, 283] and multilingual reasoning [252, 284, 285], etc. To indicate the language of
target tasks, a prepending language token is appended to each source sentence [264, 278]. Take
the multilingual NMT for example, formally, given the source sentence x′ = (x1, x2, ..., xn),
where each xi is a token in the source language, the modified source sentence is represented as
x = (li, x1, x2, ..., xn). Here, li denotes the target language. Correspondingly, the target sentence
is represented as y = (y1, y2, ..., ym), where each yj represents a token in the target language. The
probability of a target sentence is given by:
p(y|x; θ) =
J
Y
j=1
p(yi|y<j, x; θ)
(1)
where θ is a set of trainable parameters, y<j are the generated words before the j-th step. This
approach that prepends language identification is suitable for specific tasks and language situations.
However, the current model paradigm has gradually shifted to Artificial General Intelligence (AGI)
which possesses the ability like human intelligence to perform a wide range of tasks [1, 2, 286],
including understanding, learning, cognition, communication and others. Unlike small language
models, which are designed for specific tasks, AGI would have the capacity for generalization and
adaptation to novel situations, potentially surpassing human capabilities in various domains. With
the increasing scale of language models, LLMs improve the performance of downstream tasks com-
pared to small language models [276], which is closer to the goal of AGI. For the sake of generality,
the task form becomes general tasks instead of specific tasks, and prepending the language is not
allowed. Hence, most existing LLMs typically do not specify whether they function as multilingual
models or detail the number of languages they support. We consider that if a certain amount of multi-
lingual data is used in the training corpus, it can be regarded as a multilingual LLM. Among the exist-
ing models, only a few are explicitly called “multilingual LLM” (e.g., BLOOM [18], BayLing [20],
etc), yet there are also other models that possess multilingual capabilities [46, 21]. To distinguish
LLMs from multilingual LLMs, we propose a definition of “LLMs with multilingualism”.
3
Large Language Models with Multilingual Capability
Based on the training paradigm, this survey divides existing multilingual LLMs into two categories:
(1) the foundational LLMs trained from scratch and (2) the continually trained LLMs on top of the
foundational models. In Table 1, we present the statistics of the representative LLMs with certain
multilingual capabilities in the past three years.
3.1
Training from Scratch
To obtain a language model with multilingual capability, a common practice is to leverage all avail-
able data in different languages for training. The language sampling algorithms are usually applied
to control the importance of each language. As shown in Figure 3, multilingual pre-trained language
6
Name
Release Time
Params
Affiliation
Base
Available
Support Languages
GPT-3 [30]
20-05
13B, 175B
OpenAI
GPT-2
Closed
-
mT5 [31]
20-10
13B
Google
T5
Open
101
ByT5 [32]
21-05
13B
Google
T5
Open
101
Gopher [33]
21-12
280B
DeepMind
-
Open
-
LaMDA [34]
22-01
137B
Google
-
Open
-
OPT [35]
22-04
175B
Meta
-
Open
-
PaLM [36]
22-04
8B, 62B, 540B
Google
-
Closed
124
mGPT [37]
22-04
13B
-
GPT-3
Open
61
BLOOM [18]
22-07
176B
BigScience
-
Open
46
FLAN-T5 [56]
22-10
11B
Google
T5
Open
60
FLAN-PaLM [56]
22-10
8B, 62B, 540B
Google
PaLM
Open
60
ChatGLM [57]
22-10
130B
ZHIPU
GLM
Open
2
GPT-3.5 [1]
22-11
-
OpenAI
GPT
Closed
-
XGLM [38]
22-11
7.5B
Meta AI
-
Open
30
LLaMA [3]
23-02
7B, 13B, 33B, 65B
Meta
-
Open
-
GPT-4 [2]
23-03
-
OpenAI
-
Closed
-
Alpaca [58]
23-03
7B
StandFord
LLaMA
Open
-
PANGU-P [39]
23-03
1085B
Huawei
-
Closed
26
Pythia [40]
23-04
12B
EleutherAI
-
Open
-
ParroT [59]
23-04
7B
Tencent
Alpaca
Open
-
BigTrans [17]
23-05
13B
-
LLaMA
Open
102
PaLM-2 [41]
23-05
340B
Google
PaLM
Closed
-
Vicuna [60]
23-06
13B
LMSYS
LLaMA
Open
-
InternLM [42]
23-06
104B
Shanghai AI Laboratory
-
Open
-
BayLing [20]
23-06
7B, 13B
ICT/CAS
-
Open
-
PolyLM [43]
23-07
13B
DAMO Academy
-
Open
18
LLaMA-2 [3]
23-07
7B, 13B, 34B, 70B
Meta
LLaMA
Open
-
Baichuan-2 [44]
23-09
7B, 13B
Baichuan
-
Open
-
Qwen [45]
23-09
7B, 14B
Alibaba
-
Open
-
OpenChat [21]
23-09
7B, 13B
Tsinghua
LLaMA
Open
-
Mistral [46]
23-10
7B
Mistral
-
Open
-
Gemini [47]
23-12
-
DeepMind
-
Closed
40+
TigerBot [48]
23-12
7B, 13B, 70B, 180B
Tiger
-
Open
-
YAYI-2 [49]
23-12
30B
IACAS
-
Open
-
DeepSeek [50]
24-01
67B
DeepSeek AI
-
Open
-
GLM-4 [61]
24-01
-
ZHIPU
GLM
Close
-
Orion [51]
24-01
14B
OrionStar
-
Open
8+
TeleChat [52]
24-01
7B, 12B
China Telecom
-
Open
-
Aya [62]
24-02
13B
Cohere
mT5
Open
101
Claude3 [53]
24-03
-
Anthropic
-
Closed
-
InternLM-2 [54]
24-03
7B, 20B
Shanghai AI Lab
Open
-
LLaMA-3 [55]
24-04
8B, 70B
Meta
-
Open
30+
Phi-3 [52]
24-04
7B, 14B
Microsoft
-
Open
-
Table 1: An overview of representative LLMs (trainable parameters greater than 7B) that have cer-
tain multilingual capabilities in recent three years, including their release time, parameters, affilia-
tion, base model, availability, and support languages.
PLMs before 2022 mainly consisted of two structures: (1) encoder-only designed for natural lan-
guage understanding tasks and (2) encoder-decoder designed for natural language generation tasks.
The parameters of these PLMs are not comparable with the existing LLMs. Recent studies show that
according to the scaling law [276, 287, 288], the scale of the parameter has significant impacts on the
performance of the models, i.e., the larger models lead to better performance. The researchers also
observe that when the parameter scale of the language models exceeds a certain level, they not only
achieve significant performance improvements but also find some special capabilities not observed
within small-scale PLMs [276, 287]. To distinguish the difference in parameter scale, the research
community specifies the term “LLMs” compared with PLMs based on a significant scale [289].
The multilingual capabilities of PLMs are primarily obtained by combining large amounts of mul-
tilingual data in the pre-training stage. Training on multilingual corpora through pre-training objec-
tives such as mask language modeling (MLM) [271, 290] and next token prediction [272, 37, 30, 2,
3, 57, 36] endows these models with multilingual capabilities (e.g., BERT→mBERT and T5→mT5).
In particular, mLongT5 [291] integrates the mT5 training dataset and the architecture of LongT5 and
replaces the principle sentence generation (PSG) with mixture-of-denoisers (MoD) making it ideal
for multilingual pre-training.
In addition to constructing multilingual data in the pre-training stage, the cross-lingual capabil-
ities can also be improved by some specific methods (e.g., XLM [278], XLM-R [292], XLM-
V [293], XGLM [38], PaLM-2 [41], PolyLM [43], mLongT5 [291]). For instance, the series of
7
XLM [278, 292, 293] proposes a translation language modeling (TLM) pre-training task, utilizing
parallel multilingual data to improve cross-lingual model pre-training, and it extends MLM by using
batches of parallel sentences instead of consecutive sentences. Moreover, the sampling strategies are
important to balance the proportion of multiple languages in training data, which facilitates mod-
els to learn multilingual representation [38, 41, 294]. PoLyLM [43] integrates bilingual alignment
within the training corpus and implements a curriculum learning strategy to maintain a balanced
representation of various languages during the pre-training phase. The model proposes a multilin-
gual self-instruct approach, enabling the automatic generation of diverse multilingual instructions
for fine-tuning the model.
An inevitable part of the multilingual learning paradigm for PLMs is to deal with vocabulary [295,
296, 297]. The “out-of-vocabulary (OOV)” tokens hurts the translation performance naturally for
multilingual learning [298]. To alleviate this issue, ByT5 [32] is a token-free model that operates
directly on raw text (bytes or characters) which simplifies the process of different languages.
3.2
Continual Training
Another way to improve the multilingual capabilities of LLMs is continual training, which involves
updating the model with new data rather than training a model from scratch. The main idea is to
transfer knowledge from the foundation model and inject additional multilingual capability via the
updated data, which does not require excessive computational or data resources and thus reduces the
training cost.
This kind of training method utilizes existing monolingual or multilingual models for enhanc-
ing the specific languages ability (e.g., Chinese-LLaMA [299], Chinese-Alpaca [299], Chinese-
Mixtral [300], CPM-2 [301], LLaMAntino [302], FinGPT [303], Sabiá [304], Bode [305])
or extending to a wider range of languages, such as BigTrans [17], Glot500 [306] and oth-
ers [307, 308, 309]. A branch of work is to directly continually train the foundation models without
any other techniques [303, 17, 308]. For instance, Muennighoff et al. [309] introduce xP3, a corpus
consisting of tasks in 46 languages, and utilizes a cross-lingual multitask fine-tuning approach to
fine-tune the BLOOM and mT5 on the newly created corpora, along with the English-only P3 cor-
pus, resulting in the production of BLOOMZ and mT0Z. Considering the importance of vocabulary
for multilingual models, prior work employs vocabulary extension to improve performance for low-
resource languages [306]. Another branch of work is to introduce external parameters and strategies
to learn new languages for multilingual models [307]. For instance, Chinese-LLaMA [299] inte-
grates an additional 20K Chinese tokens into the original vocabulary to improve the Chinese ability,
then employs the Low-Rank Adaptation (LoRA) approach to facilitate efficient training on Chinese
corpus. CPM-2 [301] divides the pre-training into three phases, including the monolingual pre-
training, bilingual pre-training, and mixture-of-expert pre-training. Multi-phase continual training,
incorporating knowledge inheritance, offers a substantial reduction in computation costs compared
to training from scratch. Moreover, Wang et al. [310] systematically investigate strategies aimed at
reducing dependence on traditional language resources by leveraging bilingual lexicons to fine-tune
pre-trained multilingual models for underrepresented languages.
3.3
Limitations and Future Directions on Training Paradigm
Although the existing LLMs demonstrate a certain superiority in non-English language, either by
training from scratch or continuing training on top of a foundation model with extended language
data, these approaches based on text knowledge only still face challenges in addressing more com-
plex scenarios as listed below.
Low-Resource scenarios. The current training paradigm relies on large-scale data for the target
language and task, e.g., supervised fine-tuning based on annotated data or continual pre-training
based on unsupervised data. Both approaches require a substantial amount of data collection and
thus constraints the effectiveness under low-resources or multi-scenario demands.
Knowledge conflict. As the foundation model expands the supported languages, its multilingual
knowledge accumulates into the model through continuous new data available. The newly acquired
knowledge from the new data would interfere with old knowledge stored in the parameters, and thus
lead to a rapid decline in model performance. This is known as catastrophic forgetting [25], which
might result in even completely forgetting previously learned knowledge.
8
Knowledge type. The existing multilingual NLP datasets, such as XNLI [256] and XQuAD [257],
are constructed based on the translated texts from the original English version datasets [311, 312].
This is because of the high cost of obtaining multilingual data, especially in languages with limited
annotations/translators. As a result, the essence of existing datasets lies in translation-based aligned
knowledge, lacking cultural and domain knowledge in non-English contexts. This type of knowledge
learned by the models reduces the distribution shift ability in the real-world scenario, leading to sub-
optimal performance in specialized fields (e.g., finance and legislation).
To address the aforementioned problems and aim to improve the multilingual capabilities of existing
LLMs, this survey proposes the following points for future exploration:
• Training Strategies.
LLMs are data-driven and follow the scaling law which sug-
gests that increasing the model size can guarantee better generalization, higher accu-
racy, and improved ability to capture complex patterns from data.
However, such a
paradigm results in the existing training strategies primarily focusing on expanding di-
verse data, while overlooking other multilingual training techniques, such as sampling
algorithms [313, 314, 315], training objective optimization [316, 317], representation
space [318, 319, 320], and others [238, 321]. The potential of these traditional multi-
lingual training strategies has not been further explored in the current data effort paradigm
in existing multilingual literature.
• Architecture. Existing LLMs mainly rely on monolingual backbone models, such as the
standard Transformer, rather than undergoing architectural changes specifically targeting
multilingual capabilities. For the other specific tasks, for example, LLMs designed for
long texts introduce variations in positional encoding [322, 323], and those designed for
multi-modal tasks enhance alignment between different modalities [324, 325] have been
explored in some extend. Some advanced architectures like Mamba [326] have also shown
remarkable performance and may become the backbone architecture for the next generation
of LLMs. Thus, for multilingual tasks, it is essential to tailor the architecture with specific
variations rather than merely augmenting data on the standard Transformer.
• Sustainability. When trying to utilize new data to enhance existing LLMs, a practical ap-
proach is to allow LLMs to continually learn from the updated data, akin to how the human
brain operates, instead of creating new models [297, 263, 265]. Essentially, when new
language data comes up, we aim to continually extend the language support of LLMs and
improve their corresponding language capabilities while preserving the performance of
those languages that the model has already demonstrated good performance, as forming a
lifelong/incremental learning paradigm.
4
Multilingual Inference Strategies
This chapter investigates the development of robust multilingual inference strategies that are crucial
for deploying language models across varied linguistic environments.
4.1
Direct Inference in Multilingual Models
Model
Inference
XCOPA
XStoryCloze
BELEBELE
XLSum
XQuAD
TyDiQA-GP
Acc
Acc
Acc
Rouge-L
F1
F1
PaLM2-S†
En-Pivot
87.3
96.4
76.7
23.7
67.2
81.6
Direct
89.7
96.8
77.8
26.8
70.7
83.8
PaLM2-L†
En-Pivot
89.6
97.8
84.3
25.4
78.7
81.0
Direct
93.4
99.1
88.4
28.0
85.9
83.0
Table 2: The performance of LLMs using different inference strategies in the multilingual scenario.
The best score is highlighted in bold. “†” indicates the results are quoted from [63].
With the advent of LLMs, efforts to enhance the diversity of training corpora lead to the inclusion
of multiple languages alongside English. This approach endows LLMs with inherent multilingual
capabilities, which enables these models to engage in direct multilingual inference. In other words,
9
the models can process the input in their native language without requiring translation into a pivot
language. This capability is valuable as it maintains the authenticity of the linguistic and cultural
nuances present in the original text, preventing semantic distortion or information loss that might
otherwise occur during translation.
Recently, significant advancements have been made in enhancing the multilingual capabilities of
LLMs, greatly increasing the number of languages covered and the performance in non-English in-
ference. Advanced models such as GPT-4 [2] and PaLM-2 [41] demonstrate remarkable multilingual
capabilities and support hundreds of languages. The support of multiple languages enables direct
multilingual inference to become feasible and come up with a current focal point of LLM research.
As shown in Table 2, we investigate the comparison between direct inference and the pre-translation
method which translates the prompt into a high-resource language (e.g., English and Chinese) before
inference. The direct inference achieves better performance compared to the pre-translation method
based on both PaLM2-S and PaLM2-L. The result demonstrates that these two LLMs have multi-
lingual capabilities without the need to use English as a pivot for other language tasks. Moreover,
without the requirement of the translation step, the direct inference approach reduces computational
overhead and simplifies the processing pipeline with higher efficiency. The observations also con-
firm the benefits of direct inference, including the preservation of linguistic authenticity, enhanced
processing efficiency, and improved performance in low-resource languages.
4.2
Pre-Translation Inference
The direct inference may not work for all LLMs, depending on their multilingual capacities. The
existing LLMs usually perform better on those high-resource languages than the low-resource ones,
because of the imbalance ratio within the training data. To enhance the performance on low-resource
languages, pre-translation inference standardizes the input with various languages by translating
them into a pivot high-resource language (e.g., English or Chinese) before querying the LLMs,
which is based on the proficiency of the pivot language within the LLMs [65, 327, 328]. However,
the guarantee of this method relies on high-quality translation services available, which are not
necessarily true for most languages. As a result, the translation errors would accumulate and the
final output of LLMs would become wrong. Besides, translation on a pivot language obscures the
cultural and linguistic nuances of the original text, which might also lead to inaccurate results. As
an exploratory work, Liu et al. [64] explore the performance comparison between direct inference
using native languages and inference after translating into English for multilingual tasks. Although
translation can enhance the multilingual reasoning performance of English-centric LLMs, for high-
resource languages and advanced LLMs, reasoning in native languages is more effective. Besides,
pre-translating to English is a practical approach in terms of current LLMs as they are predominantly
trained on English data from their pilot experimental results. However, with the development of
direct multilingual inference, the intermediary step may not be necessary, which could allow more
authentic interactions with LLMs under multilingual scenarios.
4.3
Multilingual CoT
The Chain of Thought (CoT) is an effective approach to enhance the performance of LLMs in com-
plex reasoning [329, 330, 331], which has been extensively explored in existing studies, mainly
focusing on English [332, 333, 334]. Liu et al. [64] propose several inference strategies to investi-
gate the effectiveness of prompting the LLMs in the multilingual scenario. For instance, “Native-
CoT” indicates that asking questions in the native language with the instruction “Let’s think step
by step.” is translated into the native language. “En-CoT” indicates that asking questions in the
native language but instructing reasoning in English with “Let’s think step by step in English.” and
“XLT” [65] indicates that translating questions into English and solving them step-by-step. “Trans”
indicates that using the translation systems to convert questions into English and then solving them
step-by-step. The experimental results demonstrate that the overall performance of the CoT instruc-
tion in English (En-CoT) is better than the one with instruction in native languages (Native-CoT).
The results demonstrate that the CoT is still effective while using English to form the instructions
for non-English queries. On the other hand, multilingual CoT attempts to enhance the reasoning
capabilities of LLMs across multiple languages [66]. The multilingual CoT approach is especially
beneficial for complex reasoning tasks deeply embedded in specific cultural contexts, enabling more
natural and intuitive problem-solving [67, 68]. The common practice of multilingual CoT is to
prompt the LLMs to establish a step-by-step reasoning process in the original language of queries,
10
Module
Model
SA [335]
LID [335]
MT [336]
Summarization [337]
Es-En (F1)
Hi-En (F1)
Hi-En (BLEU)
Hi-En (ROUGE-L)
0-shot
XGLM-7.5B
68.52
0.27
1.43
5.92
LLaMA-7B
51.28
0.44
1.44
3.37
GPT-3.5-turbo
75.64
78.17
27.64
25.07
5-shot
XGLM-7.5B
61.06
16.91
3.28
5.18
LLaMA-7B
58.77
15.55
5.14
6.01
GPT-3.5-turbo
76.21
80.19
28.90
26.77
SFT
XGLM-7.5B
80.32
80.06
28.11
-
LLaMA-7B
77.21
55.32
16.58
-
Table 3: The overall results on code-switching benchmark for LLMs. We report the 0-shot, 5-shot,
and SFT performance. SFT only adapts to open-resource LLMs. “SA”, “LID”, and “MT” denote
the Sentiment Analysis, the Language Identification, and the Machine Translation, respectively.
which can preserve linguistic and cultural nuances. In addition, the results corresponding to differ-
ent sizes of LLaMA-2-Chat attend to examine the impact of scaling law with different multilingual
inference strategies.
The understanding of the syntax and semantics of various languages, such as idiomatic expressions
and culture-specific references is challenging for existing LLMs. A recent study [69] introduces a
cross-lingual CoT reasoning instruction fine-tuning framework, which randomly replaces language
fragments with those from low-resource languages, and mixes the original and target languages
within a single query. Besides, this study creates multilingual CoT instruction training data, which
can be used to supervise fine-tuning LLMs to reduce the performance gap across different languages.
However, developing datasets for training and evaluating multilingual CoT capabilities requires a
robust representation of linguistic diversity and detailed language-specific nuances, which should be
further addressed.
4.4
Code-Switching
Code-switching refers to the phenomenon where communicators switch between two or more lan-
guages during linguistic interactions, based on contextual needs. This phenomenon is common in
bilingual or multilingual communities, especially in spoken communication [338, 339]. For exam-
ple, in conversations involving Chinese-English or Spanish-English direction, speakers may freely
switch between languages depending on the fluency, precision of expression, or emotional needs of
the dialogue [340, 341, 335]. Solving code-switching texts is an important and challenging task as
the language IDs are not specified before LLMs inference [70, 71].
As shown in Table 3, we investigate the performance of LLMs on code-switching tasks. The re-
sults demonstrate that open-source LLMs cannot deal with the code-switching problem that needs
to process multiple languages simultaneously under a single query. Multiple languages increase the
complexity of processing and understanding language for models and LLMs need to continue to be
supervised fine-tuned to accommodate simultaneous processing in this scenario. In addition, to im-
prove the ability to deal with code-switching texts, researchers develop new pre-training techniques
to enhance the understanding capacity of this linguistic phenomenon in LLMs [72]. For instance,
Das et al. [342] modify the MLM [271] to enhance model reasoning performance in code-switching
environments. By employing code-switching corpora, it masks tokens at the boundaries between
two languages, thus forcing the model to learn semantic nuances at the points of language tran-
sition. Additionally, this work introduces modifications to the model structure by adding residual
connections from intermediate layers to the final layer. An auxiliary loss function based on the
representations of intermediate layers is also proposed, which enhances the cross-lingual ability to
understand multiple languages in a single sentence. However, the cost of annotated code-switching
data is expensive and it is challenging to investigate the non-parametric or semi-parametric method
to adapt the code-switching problems.
11
4.5
Multilingual Retrieval Augmented Generation
Retrieval-Augmented Generation (RAG) is a methodology that integrates text generation with ex-
ternal knowledge retrieval, dynamically enhancing the quality of model response and accuracy by
accessing relevant information [343, 344]. This approach enables the model to utilize up-to-date
or specialized knowledge in text generation, thereby increasing its practicality and reliability. A
main branch of the multilingual RAG adopts to retrieve knowledge from the open domain and ap-
plies it to the in-context (i.e., augmented prompt) [73, 74, 75, 76, 77, 78, 79, 80, 81]. In particular,
Thakur et al. [82] propose NoMIRACL, a dataset across 18 languages, to evaluate the hallucination
of LLM when given a piece of text in external retrieved knowledge. It consists of two parts, the non-
relevant and the relevant subset, corresponding to the question and the passage which are non-related
and related, respectively. The model is expected to answer “I don’t know” in the non-relevant subset,
otherwise it is determined as a hallucination. In addition, hallucinations and off-target issues occur
when incorporating LLMs with low-resource machine translation [83], where the RAG can miti-
gate these issues via improving the translation quality for low-resource directions [84, 85, 86, 87].
Overall, the RAG can effectively facilitate LLMs to generate more reliable responses, alleviating
the issues of hallucination and factual error without fine-tuning. However, achieving substantial
enhancements solely through the RAG method for low-resource languages, where LLMs struggle,
poses a considerable challenge. Meanwhile, it is also challenging to build retrievers that can be used
in low-resource languages [88].
4.6
Limitations and Future Directions on Inference Strategies
The multilingual inference strategies exhibit a diverse range of characteristics. Although existing
methods contribute to the performance of LLMs to some extent in the multilingual scenario, they
still have many limitations as follows.
Universal inference paradigm. Previous PLMs are task-specific and language-specific, indicating
that it is essential to specify the language ID. For instance, we need to assign the language ID of input
and output respectively when leveraging the M2M-100 for machine translation [345]. However,
it is not required in the existing paradigm of LLMs, such as GPT-4. Due to the universality of
LLMs, an aim is to keep them as task-agnostic and language-agnostic as feasible. Current LLMs
employ a standardized approach for inference across all languages (either direct inference, pre-
translation inference, CoT, or RAG). However, as shown in the experiments and analyses above,
the inference strategies exhibit varied performances when faced with different LLMs, tasks, and
languages. Therefore, a flexible and universally applicable paradigm is desirable to uniformly handle
the environments of all languages (i.e., high-/medium-/low-resource languages).
Language-Specific characteristics. Existing multilingual inference strategies are primarily adapted
from monolingual (e.g., English) strategies, lacking exploration of language-specific characteristics.
For example, the prompt engineering for a low-resource language is derived from English instruc-
tions, but these prompts are more aligned with the habits of English speakers instead of native speak-
ers. Therefore, the approach might pose challenges in harnessing the potential of native languages
during inference with LLMs.
Emergence ability. One important advantage of LLMs is the emergence ability that is informally
defined as “the ability that does not exist in small models but appears in large models” [346]. How-
ever, this advantage is not embodied significantly in multilingual scenarios. Thus, the performance
of LLMs is far behind that of the English scenario, and difficult to outperform small language mod-
els. It is not only due to limitations during the training phase but also potentially influenced by
inappropriate strategies during the inference phase.
Model collaboration. Existing inference pipelines are designed for single LLMs. Due to data
scarcity in low-resource languages, it is challenging to address tasks for all languages within a single
model [347, 348]. Considering that the smaller models excel at specific tasks or handling specific
languages, which do not require large-scale data to optimize [349, 350, 351]. It is beneficial to
leverage the strengths of both large and small models and solve tasks for different resource languages
through model collaboration. The model collaboration that effectively bridges the large and small
models is a direction yet to be explored for enhancing inference performance in the multilingual
scenario.
12
5
Multilingual Information Retrieval
The task of Information Retrieval (IR) is to find the relevant documents that satisfy the information
needs of the users (in the form of queries) from a large collection [352]. Multilingual IR studies
the IR tasks in more than only English, and is generally categorized into the monolingual, cross-
lingual and multilingual scenarios based on the language(s) of the queries and documents: Given a
query in the language (L1), monolingual retrieval aims to find relevant information from the same
language as the query (L1), cross-lingual retrieval finds relevant information from a different lan-
guage (L2), and multilingual retrieval finds relevant information from multiple different languages
(Li, i ∈{1, ..., n}). There are many surveys and discussions related to this section, including
multilingual retrieval progress prior to neural IR [353, 354, 355, 356, 357, 358, 359, 360, 361],
progress on general neural IR prior to the emergence of LLMs [362], and interplay of LLM and
IR [363, 364, 365]. This section will focus on the multilingual aspect, especially the new opportu-
nities of multilingual retrieval brought by LLMs (“LLM for mIR”), as oppose to the RAG methods
(“mIR for LLM”) introduced in the Section 4.5 above.
5.1
Synthetic Training Data
Synthetic datasets for multilingual retrieval are traditionally created in two approaches: machine
translation [115, 366], and natural semantic structures [367], e.g., title–passage [368], inner-
connected Wikipedia links [369, 370], and so on.
Spearheaded by InPars [89, 90, 91] and Promptagator [92], LLMs bring the third approach, which
generates large-scale synthetic data for training retrieval models in an affordable way. While the
above two works focus on English, following this line, SwimIR [93] builds large-scale training data
for both cross-lingual and monolingual retrieval tasks. JH-POLO [94] build cross-lingual retrieval
training data by generating English queries based on non-English positive and negative passages
using LLM. It has also been found that synthetic data generated by LLM could improve the perfor-
mance of LLM-based embedding models: mE5-Mistral [95] generate synthetic data by GPT-3.5 and
GPT-4 on 93 languages. Gecko [96] built Few-shot Prompted Retrieval dataset (FRet). Both works
adopt a two-stage generation pipeline: in the first stage, the LLM generates the query and the task
description(s) given passage(s); in the second stage, while both works produce positive and (hard)
negative passages, Gecko asks LLM to score the positive and negative passages from candidates
returned by a retriever, while mE5-Mistral lets the LLM generate the positive and negative passages
based on given requirements. Additionally, Arctic-Embed [97] find that hard negative mined from
existing corpora is in higher quality compared to the ones generated by LLM.
5.2
Multilingual Retrievers
According to the taxonomy by Lin and Ma [371], the retrievers are categorized into the unsupervised
sparse, supervised sparse and, supervised dense models, where the dense models could be further
categorized into the single-vector and multi-vector models. This section briefly introduces models
under each category that are extended into multilingual scenarios, and the impact of LLMs on the
category if applicable.
The unsupervised sparse models refers to the bag-of-words exact matching ranking algorithms, e.g.,
BM25 [372]. It requires language-specific analyzers to extend the models into the multilingual
scenarios, which are designed based on expert knowledge on the target language. This category of
models serves a strong baseline itself on the mono-lingual retrieval task [373], or on the cross-lingual
and multilingual retrieval when used together with the query or document translation [374, 375, 376].
The supervised sparse models learn the weight per term from the training data rather than using the
collection statistics as unsupervised sparse models [377, 378, 379, 380, 381, 382]. Works extend-
ing this category into the multilingual scenarios are mainly surrounding SPLADE on monolingual
retrieval [383] or cross-lingual retrieval [384, 385]. All above works are based on BERT-level mul-
tilingual pretrained models.
The supervised dense models category, including both the single-vector and multi-vector dense
retrieval models, resides most of the work on the multilingual IR and LLM-related embedding
models. The dense models was firstly extended into the multilingual scenarios by switching the
backbones into mBERT or XLM-R [373, 386, 387]. Many methods that are found effective on
13
English also show similar performance improvements on the multilingual scenarios, for exam-
ple, extending the pretraining and pre-finetuning corpora into multilingual unsupervised data or
translated corpora [115, 387], knowledge distillation from rerankers [387] or even from English
retriever [388]. Recently, more multilingual embedding models are proposed with large-scale pre-
training and pre-finetuning. Open-source models include mE5 [98], mGTE [99], and BGE [100],
whereas [101, 102, 103] provide black-box API for the multilingual embedding models.
Many LLM-based embedding models emerge these years: Focusing on the retrieval task, Re-
pLLAMA [104] shows that LLM-based embedding models could be fine-tuned to achieve better in-
domain effectiveness and out-of-domain generalizability. PromptReps [105] shows that the LLMs
could be prompted to generate dense and sparse representations to achieve competitive zero-shot
performance on the passage retrieval tasks. More works emerge with the target of unifying mul-
tiple embedding tasks into a single model [106]. The modification on the model design includes:
enabling bi-directional attention [107, 108, 109], adding instructional tuning [107, 110], adapting
Matryoshka representations [101, 111], and merging multiple models [112]. Training wise, An-
glE [113] proposed angle-optimized text embedding models to eliminate the gradient saturation
zone of cosine function. Yet most of the work along this line focuses on English embedding models,
only Gecko [96] supports the multilingual inputs. Additionally, NLLB-E5 [114] propose to integrate
NLLB models with E5 to enable the multilingual ability of English embedding models.
Works extending multi-vector dense retrieval models into multilingual scenarios mainly focus on
ColBERT [389], dubbed mColBERT [115, 116] or ColBERT-X [117].
The extension covers
monolingual retrieval [115, 122, 116], cross-lingual retrieval [117, 118, 119], and multilingual re-
trieval [120, 121]. Other than adopting the default model structure, ColBERT-XM [122] adds mod-
ular language-specific adapter in XMOD architecture, which shows competitive zero-shot monolin-
gual retrieval performance. BGE-M3 [123] unites the single-vector dense, multi-vector dense and
sparse models by distilling the knowledge from the ensemble of the three types of models into each
single models, demonstrating strong on both monolingual and cross-lingual retrieval tasks.
5.3
Multilingual Rerankers
Early works multilingual neural rerankers are mostly based on mBERT [390], exploring the transla-
tion configuration on the training and inference stages [391, 392]. Later works found that mMiniLM
and mT5 serve as better backbones as multilingual rerankers [115, 124].
Recently, a line of works explored using LLM as the zero-shot rerankers in retrieval initiated by
RankGPT [125] and LRL [126], dubbed listwise rerankers, followed by works on distilling from
the GPTs with enhanced training techniques [128, 129], and on building listwise reranker without
relying on the close-sourced GPT-models [130]. One criticism on the listwise rerankers is the se-
quential inference step caused by the sliding-window aggregation step that merges the ranked docu-
ments from different batch. To address the issue, different inference and aggregation strategies have
been proposed, including Setwise [127] and TourRank [131]. Limited works explored the listwise
rerankers on the multilingual IR tasks, the only one to our best knowledge is Adeyemi et al. [132],
which evaluated GPT-based listwise reranker on CIRAL [393], a cross-lingual retrieval benchmark
on African languages, finding that GPT-4 yields competitive zero-shot performance on the task and
even on par with the zero-shot results with machine-translated documents on some of the languages.
5.4
Challenges and Future Directions on Multilingual Information Retrieval
The aforementioned existing studies demonstrate how LLM-based methods enhance the effective-
ness and out-of-domain generalization in information retrieval tasks. Beyond integrating LLMs as
components in the established retrieval-reranking pipeline, LLMs also open new possibilities to the
paradigm of search process and broader information access: For example, Li et al. [394] and Lee
et al. [395] both propose a unified generative framework that integrates retrieval and question an-
swering, where retrieval is considered as an inherent part together with the other generative tasks
rather than as a separate component as in RAG.
That said, challenges present in deploying LLM in assessible search systems, which include in-
herently high latency for indexing and searching, as well as high computational demand during
inference and fine-tuning. Current work that distills knowledge from LLM to smaller models strike
a balance between effectiveness and efficiency [396].
14
Model
Prompt-Based Jailbreak
JailBroken [135]
GPTFUZZER [398]
AutoDAN [140]
DeepInception [399]
ICA [400]
PAIR [401]
ReNeLLM [402]
GPT-3.5-turbo
100%
35%
45%
66%
0%
19%
87%
GPT-4-0613
58%
0%
2%
35%
1%
20%
38%
LLaMA-2-7B-Chat
6%
31%
51%
8%
0%
27%
31%
LLaMA-2-13B-Chat
4%
41%
72%
0%
0%
13%
69%
Vicuna-7B-v1.5
100%
93%
100%
29%
51%
99%
77%
Vicuna-13B-v1.5
100%
94%
97%
17%
81%
95%
87%
ChatGLM-3
95%
85%
89%
33%
54%
96%
86%
Qwen-7B-Chat
100%
82%
99%
58%
36%
77%
70%
Intern-7B
100%
92%
98%
36%
23%
86%
67%
Mistral-7B
100%
99%
98%
40%
75%
95%
90%
GCG series
Multilingual Jailbreak
GCG [134]
Multilingual [143]
Cipher [148]
CodeChameleon [403]
GPT-3.5-turbo
12%
100%
80%
90%
GPT-4-0613
0%
63%
75%
72%
LLaMA-2-7B-Chat
46%
2%
61%
80%
LLaMA-2-13B-Chat
46%
0%
90%
67%
Vicuna-7B-v1.5
94%
94%
28%
80%
Vicuna-13B-v1.5
94%
100%
76%
73%
ChatGLM-3
34%
100%
78%
92%
Qwen-7B-Chat
48%
99%
58%
84%
Intern-7B
10%
99%
99%
71%
Mistral-7B
82%
100%
97%
95%
Table 4: An overview of Greedy Coordinate Gradient, Prompt-Based and Multilingual attack
methods jailbreaking for LLMs on the AdvBench [404]. The evaluation method is consistent with
the EasyJailbreak [404] framework, which uses GPT-4-turbo-1106 as the scoring model and the
evaluation prompts from GPTFUZZER [398].
Beyond the general challenges of LLM-based retrieval, The open-source state-of-the-art LLM
usually have fewer supported languages compared to encoder-only or encoder-decoder models:
LLaMA-3 [397] and Command-R+‡ support around 20 languages, while encoder-only models such
as mBERT and XLM-R support 100 languages, and translation-targeting encoder-decoder such as
NLLB support 200 languages. Current retrieval methods are applied to LLMs, which mainly regard
LLMs as a knowledge store. However, in low-resource languages, LLMs lack generation capabil-
ities and have not been trained with large-scale data, thus they are difficult to serve as a reliable
source of knowledge. How can the above methods be applied to languages not yet supported by
LLM but available in smaller language models?
6
Security of Multilingual Large Language Models
With the wide deployment of LLMs in various applications, increasing security concerns have
emerged. This chapter introduces the security aspects of LLMs in the multilingual scenario, specif-
ically exploring attack methods and the existing research on defense mechanisms. Since there are
no clear definitions to distinguish whether an LLM is a multilingual model or not, this survey not
only focuses on security issues specific to different languages but also provides a perspective on
common security issues. The investigated methods work equally across all languages and can be
easily transferred to multilingual scenarios, providing inspiring thoughts on future research.
6.1
Attack Methods
To explore the security of LLMs, a red team attack on LLMs is required. A red-team attack is a
cybersecurity exercise where a group of ethical hackers, known as the red team, simulate real-world
cyberattacks on an organization’s systems, networks, or infrastructure. The goal of a red-team attack
is to identify vulnerabilities, weaknesses, and potential security breaches that malicious actors could
exploit [405]. A common practice is the “jailbreak” attack which typically refers to the unauthorized
access or modification of the underlying code or functionality of models. Essentially, it involves
breaking out of the constraints or limitations imposed by the design or usage policies of LLMs. It
includes techniques to bypass security measures or enable functionalities that are not intended or
permitted by the developers.
According to the criteria in existing studies [153, 404], the jailbreak methods on LLMs can be
divided into three types: Greedy Coordinate Gradient (GCG) jailbreak [133, 134], prompt-based
‡https://docs.cohere.com/v2/docs/command-r-plus
15
Characteristic
Attack Method Types
GCG series
LLM-Based
Rule-Based
The LLM type for optimizing prompt
Target LLM
Agent LLM
-
The status of Jailbreak prompt
Dynamic
Dynamic
Static
The form of generating new prompts
Auto
Auto
Manual
Table 5: An overview of comparison among GCG, Prompt-based and Rule-based jailbreak meth-
ods. Target LLM and Agent LLM refer to the attacked LLM and other LLMs that are different from
target LLM, respectively.
jailbreak [135, 136, 137, 138, 139, 144, 140, 141] and multilingual jailbreak [142, 143, 144, 145,
146, 147, 148, 149]. In this section, we focus on these three jailbreak methods, especially the multi-
lingual jailbreak. The first two methods involve generic attacks on LLMs, and the latter emphasizes
jailbreaking through multiple languages. All these methods are aimed at bypassing the security
measures of LLMs to generate malicious information. Since most of the jailbreaking methods are
customized, the effectiveness of each method varies depending on the specific LLMs. To provide a
comprehensive comparison, we investigate the performance of different jailbreaking methods across
various LLMs based on a unified evaluation framework, as shown in Table 4.
6.1.1
Greedy Coordinate Gradient Jailbreak
The Greedy Coordinate Gradient [134] is an attack method based on greedy algorithms and gradient
metric design hints. It first creates a seed prompt, and then iteratively replaces the tokens. The best
prompt for attacking the model is determined by calculating the gradient. Sitawarin et al. [133]
propose GCG++ to increase the attack success rate (ASR) of the original GCG method on LLaMA-
2-7B. On the basis of the original GCG, they replace the cross entropy loss with multi-class loss to
avoid vanishing gradients in the Softmax, which is effective in attacking LLM. Another discovery
is that LLMs such as LLaMA-2-7B are format sensitive, having a strong prior for predicting a space
token at the beginning of the model response. GCG++ adds a simple format-ware target string (i.e.,
“[ASSISTENT]:” before the input prompt to force the model to output harmful content. Through
the two changes, GCG++ increases the GCG attack success rate on LLaMA-2-7B from 56% to 80%.
6.1.2
Prompt-Based Jailbreak
The prompt-based methods aim to mislead LLM into generating harmful content based on specifi-
cally designed templates. Among them, LLM-based [140, 406, 133, 401, 138, 398, 402, 407] and
rule-based [135, 399, 136, 137, 144] are the two common used methods for designing attacking
prompts. The differences between GCG, LLM-based, and rule-based are presented in Table 5 with
various aspects.
Rule-based jailbreak methods are those works that design specific prompts to formulate rules for
LLMs [135, 399], or directly collect prompts from various channels such as websites and fo-
rums [136, 137, 144]. Rule-based jailbreak methods rely more on human participation because
these rules are customized based on empirical experience in specific scenarios. Thus, the produced
prompts are effective in a narrow area but lack versatility and are static, which can be easily de-
fended.
LLM-based jailbreak methods leverage the instances of LLMs to optimize existing attack prompts
or generate new jailbreak prompts. Different from the GCG series approaches, the principle of
LLM-based jailbreak methods acts as using an agent LLM to attack a target LLM. Existing studies
[140, 406, 133, 401] usually take the agent LLM as an optimizer, scoring module or evaluator
to optimize prompts for attackers. Some other methods [138, 398, 402, 407] use the generation
capabilities of LLM to perform multiple operations such as rewriting and shortening feasible attack
prompts. They also wrap harmful prompts with scenarios to avoid safe alignment. These operations
based on LLMs can enable the original attack prompt to evade the security alignment policy.
6.1.3
Multilingual Jailbreak
Due to the unequal security alignment of LLMs across different languages, with higher security
in high-resource languages compared to low-resource languages, the multilingual jailbreak meth-
16
ods [142, 143, 145, 146, 147] attend to cheat the LLMs via the alignment vulnerabilities between
high-resource and low-resource language. Some other methods [148, 149, 403, 135] use special
encoding or ciphers to disguise harmful prompts to achieve jailbreak, which can be considered as a
type of special language.
The existing studies on the potential security risks of LLMs, primarily focused on the usage of
English scenarios. Under the multilingual scenario, Deng et al. [143] reveal the presence of mul-
tilingual jailbreak challenges within LLMs, who divide potential risks into two scenarios: (1) un-
intentional and (2) intentional. The unintentional scenario involves users inadvertently bypassing
the safety alignment by querying LLMs with non-English prompts, while the intentional scenario
refers to users intentionally combining malicious instructions with multilingual prompts. Compared
to high-resource languages, low-resource languages are approximately three times more likely to
encounter harmful content in GPT-3.5 and GPT-4, and thus the LLMs are much easier to attack
via low-resource languages. This could also be the reason why the model attack approaches are
designed with low-resource languages within these two scenarios.
For the unintentional scenario, Shen et al. [142] indicate that the bottleneck in cross-lingual align-
ment lies within the training stage of LLMs. Thus, they study the effect of instruction tuning with
RLHF and supervised fine-tuning (SFT) on the HH-RLHF dataset [408]. The results show that
although training with high-resource languages can improve model alignment, the effect of train-
ing with low-resource languages is still negligible. For the intentional scenario, various prompts
are designed to bypass the security defenses of the LLMs via high-resource languages. In partic-
ular, Yong et al. [145] successfully circumvent the safeguard of GPT-4 by translating unsafe En-
glish prompts into low-resource languages. They propose the LRL-Combined Attacks approach to
achieve 79% ASR on the AdvBench dataset [134]. Xu et al. [146] study a new type of black box
jailbreak attack, Cognitive Overload, which is specifically designed for the cognitive structure and
processes of LLMs. With Google Cloud API, they translate original English harmful instructions
from AdvBench and MasterKey [138] into 52 other languages and propose multilingual cognitive
overload [409, 410] to hinder in-context learning and inference process when the knowledge ex-
ceeds the limited capacity of LLMs [411]. By using Google Cloud API to translate English to other
52 languages and nllb-200-distilled-1.3B to translate other non-English responses back to English,
they conducted a multilingual version of their attack method. With multilingual Cognitive Overload,
their results show that LLMs are more vulnerable to non-English adversarial prompts. The observa-
tion indicates that the further a language is from English, the more effective the malicious prompt
conveyed is in attacking LLMs. Moreover, Li et al. [147] conduct an extensive empirical study
on multilingual jailbreak attacks, which develops a novel semantic preservation algorithm to create
multilingual jailbreak prompts. With these prompts, they reveal patterns in multilingual jailbreak
attacks and implement fine-tuning mitigation methods for defending against cross-lingual jailbreak
attacks.
Password jailbreak. From the perspective of writing scripts, special encoding or password can be
considered as a language conversion, i.e., an English prompt can be converted into a password rep-
resentation by encryption. Though the password representation can also be converted to English or
other languages via decryption, the encrypted prompts cannot be understood directly by humans but
by the LLMs, and thus could lead to secure alignment fails. For example, Huang et al. [149] pro-
pose the generation exploitation attack to manipulate variations of decoding methods (e.g., greedy
decoding and sampling-based decoding), which can easily disrupt model alignment because existing
alignment procedures are based on default decoding settings. Vulnerabilities are exposed when con-
figurations of decoding change slightly. Yuan et al. [148] propose a novel framework CipherChat to
examine the generalizability of safety alignment to non-natural languages, where the user can chat
with LLMs through cipher prompts. Furthermore, Lv et al. [403] introduce a hypothesis for the
safety mechanism of LLMs: intent security recognition followed by response generation. Following
this hypothesis, they propose CodeChameleon to transform queries into decryptable formats with
custom Python functions. This approach enables the modification of the original query and achieves
state-of-the-art ASR on 7 LLMs. Besides, Wei et al. [135] propose Jailbroken, which obfuscates the
queries using base64 to bypass the safety training of LLMs. They observe that LLMs can understand
base64 but cannot defend against attacks under base64.
Other jailbreak. Apart from the aforementioned methods, Shayegani et al. [412] combine an im-
age targeted towards toxic embeddings with generic prompts to accomplish the jailbreak, which
utilizes four embedding space target strategies to poison the vision encoder. Their attacks achieve
17
Model
Attacker: PAIR [401]
No Defense
SmoothLLM [150]
Perplexity Filter [152]
GPT-3.5-turbo
76%
12%
15%
GPT-4-0125-preview
50%
25%
43%
LLaMA-2-7B-chat
4%
1%
4%
Vicuna-13B-v1.5
82%
47%
81%
Attacker: GCG [134]
GPT-3.5-turbo
34%
1%
1%
GPT-4-0125-preview
1%
3%
0%
LLaMA-2-7B-chat
2%
1%
0%
Vicuna-13B-v1.5
58%
1%
1%
Attacker: JBC [416]
GPT-3.5-turbo
0%
0%
0%
GPT-4-0125-preview
0%
0%
0%
LLaMA-2-7B-chat
0%
0%
0%
Vicuna-13B-v1.5
79%
64%
79%
Table 6: An overview of defense methods under jailbreaking on listed LLMs. The evaluation method
for the Attack Success Rate (ASR) indicator is consistent with JailbreakBench [417]. The responses
of LLMs are evaluated using LLaMAGuard-7B.
87% and 63.3% ASR on two vision-language models, LLaVA [325] and LLaMA-Adapter V2 [413],
respectively. Rando et al. [414] embed a “jailbreak backdoor” into the LLM by poisoning the RLHF
training data. Then, users can easily achieve jailbreak by using a trigger word like the “sudo” com-
mand in the Linux system. Wolf et al. [415] propose a theoretical approach Behavior Expectation
Bounds (BEB) that investigates several limitations of alignment in LLMs, which exposes fundamen-
tal problems and emphasizes the necessity of designing reliable mechanisms to ensure AI safety.
6.2
Defense Methods
Only a few studies attempt to address the defense methods in the security LLMs, which can be
categorized into open-source and close-source LLMs. Based on the available access to the open-
source LLMs, the existing studies [143, 147, 150] enhance the security by fine-tuning the foundation
models with security instructions. For closed-source LLMs, previous works [154, 153, 150, 152]
defend the risks by auditing the input prompts with various security judgment strategies. However,
these simple mechanisms cannot achieve satisfactory performance, as shown in Table 6. The results
demonstrate that it is difficult to completely eliminate the generation of unsafe content, regardless of
the defense mechanism. And “SmoothLLM” [150] performs better than “Perplexity Filter” [152] but
still generates over 10% unsafe content in most scenarios. It indicates that current defense methods
for LLMs are in the early stages and require further exploration.
6.2.1
Defense Methods for Open-Source LLM
Robey et al. [150] propose SmoothLLM, a compatible defense method that acts as a wrapper to
smooth the outputs of LLMs by perturbing original attack inputs. Although effective in prohibiting
the attacking intent, it also disrupts the semantics of the original input and leads to performance
degradation. Deng et al. [143] propose a data augment defense framework SELF-DEFENSE to
defend the attacks for both unintentional and intentional scenarios. The key idea is to translate
some English seed examples into a target language and then merge the language-specific corpora
into the original dataset. Li et al. [147] implement a fine-tuning mitigation method based on their
multilingual jailbreak prompts dataset, reducing the attack success rate by 96.2%. Zhou et al. [151]
introduce Robust Prompt Optimization (RPO) to LLM security by minimizing the confrontation
loss. With less impact on benign cues, the success rate of attacking GPT-4 with GUARD [141]
dropped from 96% to 4%.
18
6.2.2
Defense Methods for Closed-Source LLM
For closed-source LLM, the defense algorithms mainly focus on dealing with the model inputs.
Jain et al. [152] introduce a filter method, judging the danger of the input based on the perplexity.
Wu et al. [153] propose a simple and effective defense method SELFDEFEND, which incorporates
a shadow stack to check whether harmful prompts exist in the input. Li et al. [154] introduce a
Rewindable Auto-regressive INference (RAIN) approach, which has the same evaluation setting
as SELFDEFEND but focuses on the output of LLMs. The key component is to leverage another
LLM to score the output content and determine whether the output contains harmful content, which
achieves good results on LLaMA-base models.
6.3
Limitations and Future Directions on LLM Security
In previous sections, we provide a detailed introduction to the research achievements in attack and
defense in terms of LLMs security. Most of the current research on LLM security is tested on
those popular models (i.e., GPT-3.5, GPT-4, and LLaMA) with multilingual capabilities. Based on
the summary of existing approaches for general attack and defense, we explore the following two
aspects as future directions: (1) Jailbreak by targeting the multilingual ability of LLMs. (2) How to
improve the robustness of LLMs in multilingualism.
6.3.1
Jailbreak by Targeting the Multilingual Ability of LLMs
Low-Resource language attack. Although LLMs already have strong multilingual capabilities,
they cannot remedy the weakness of low-resource languages in the corpus. The ability of LLMs to
identify harmful contents in low-resource languages becomes much worse. Existing studies [145,
143, 142] explore a lot in low-resource languages, while only focusing on GPT-4 with incorporated
translation models. Such a pipeline would inevitably introduce noise. Meanwhile, the evaluation
standards should be improved to identify the security capacity of LLMs.
The asymmetry between different languages. Language security is highly culturally specific,
and each language has its own security vulnerabilities, leading to asymmetry. For example, the
word “uso” has insulting connotations only in Basque, thus it needs specific supervised tuning
for each language, which is difficult to transfer from other languages. This contradicts the tradi-
tional multilingual methods, where knowledge between different languages can be mutually ben-
eficial [264, 265]. Xu et al. [418] empirically validate the presence of multilingual human values
within LLMs, encompassing many categories of human values across multiple languages and LLM
series. However, the problems of asymmetry between different languages have risen, and no existing
studies about it.
Customized encryption and language rules.
To bypass the security mechanism of LLMs,
an innovative way to create a new language “X” by customizing some language or encryption
rules [403, 149, 148] from the original input. This is based on the translation paradigm, which can
be viewed as a mapping function to transform character set A to character set B. Thus, exploiting
the potential loopholes when aligning LLMs in different languages becomes an important problem.
Misleading information in specific languages. The prior method attempts to assign a word with a
specific meaning by embedding a backdoor or directly defining it through dialogue [414, 141]. For
instance, Rando et al. [399] insert the word “SUDO” at the end of the query, causing the LLM to
misunderstand and bypass the security defenses. It provides insight for attacking the LLMs through
multilingual languages. People can introduce words or phrases with specific meanings into queries
provided to LLMs. It can lead to the model misunderstanding the meaning of queries, which results
in the generation of harmful information. In particular, the polysemous phenomenon that is prevalent
in most languages can be used to mislead LLMs into producing prohibited content.
6.3.2
Robustness of LLMs with Multilingualism
Existing studies intend to attack LLMs to find some leaks, rather than to improve the defense ability
and robustness of LLMs. However, an attack or jailbreak cannot ensure the development of LLM
security. In this section, we will discuss the potential solutions for improving the security and
robustness of LLMs.
19
Model
Params
Base Model
Training Corpus
Name
Non-English
proportion
Translated
Size
Languages
BioMistral [156]
7B
Mistral-7B
PMC
1.25%
×
3B
10
MMedLM2 [157]
7B
InterLM2-7B
MMedC
58%
×
25.5B
6
Apollo [158]
0.5/1.8/2/6/7B
Qwen/Gemma/Yi
Apollo
33.72%
×
2.5B
6
Medical mT5 [160]
0.77/3B
mT5
-
66.67%
×
3B
4
L2M3 [159]
70B
Meditron&
SeamlessM4T
-
80%
✓
0.9*5B
5
Table 7: An overview of the existing competitive LLMs with multilingualism in the medical do-
main. Languages denotes the number of languages included in the training corpus. Non-English
proportion denotes the proportion of non-English languages in the training corpus. The training
dataset of L2M3 is obtained by translating English into four low-resource languages: Telugu, Hindi,
Swahili, and Arabic.
Adversarial training with multilingual samples. Inspired by Mazeika et al. [419], the proposed
method enhances defense and robustness using adversarial training. Unlike fine-tuning on fixed
datasets with harmful prompts, they propose a Robust Refusal Dynamic Defense to fine-tune the
LLM on a dynamic pool of samples, which are continuously updated through a strong optimization-
based jailbreak method. It is feasible to incorporate multilingual data into the sample pool using
multilingual jailbreak methods which are more practical in attacks, making the data in the sample
pool more diverse and advantageous for adversarial training. Besides, adversarial training can be in-
troduced in the pre-training stage or fine-tuning stage of LLMs. As a result, the safety and robustness
of LLMs with multilingualism can be enhanced at the root by adversarial training.
Multilingual security alignment with data augmentation. Similar to the approach of enhancing
LLMs instruction-following capabilities and human values proposed by SFT and RLHF [1], effec-
tive data augmentation is the direct way to improve multilingual alignment. Thus, it is beneficial to
explore ways to construct multilingual security datasets facing the localization of security informa-
tion across languages. Depending on the business or scientific requirements, the datasets can contain
different harmful question pairs and languages and then fine-tune the generic LLM with customized
security datasets to construct a more robust version of LLMs.
Pre-processing prompts or post-processing outputs. Another approach with fewer resources is to
add proxy security efforts in small models outside of LLMs. Before constructing prompts for the
LLM, we can consider maintaining a harmful vocabulary list or using another LLM as an evaluator
to extract dangerous elements and judge the security of prompts, which can help detect unstable
factors. The judgment outputs from LLMs with scores indicate whether the risks are identified in
the original inputs and need to be rewritten, similar to RAIN [154]. The general goal is to force
LLMs to reject harmful answers or replace them with a rule-based template.
7
Multi-Domain LLMs in Multilingual Scenarios
The remarkable capabilities of LLMs have facilitated their application across diverse domains,
including finance [27, 420, 421, 422, 423, 424], medicine [425, 426, 427, 428, 429, 430, 431],
law [432, 433, 434, 435, 436], education [437, 438], transportation [439] etc. These domain-specific
LLMs have demonstrated superb capability and promising perspective within associated domains.
However, these LLMs are predominantly focused on English, while fewer cater to medium or low-
resource languages, which dramatically hinders the utility of LLMs for a global audience. In this
chapter, we present the pioneering multilingual studies conducted in the medical and legal domains§,
and we conclude by offering a comprehensive discussion on the emerging limitations and challenges.
7.1
Medical Domain
Previous works have made substantial strides in integrating LLMs into the medical domain [425,
426, 440]. In particular, Med-PaLM2 [441] notably achieves success by passing the US Medical
§To the best of our knowledge, at the time we conduct our survey, there are few pertinent works in other
domains such as finance and education in multilingual scenarios.
20
Model
Benchmark
Name
Translated
Task
Metrics
Languages
BioMistral[156]
-
✓
Multi-choice QA
ACC
en,ar,zh,fr,de,pt,ru,es
MMedLM2[157]
MMedBench
✓
Multi-choice QA
Rationale eval
ACC
ROUGE-1/BLEU-1
en,zh,ja,fr,ru,es
Apollo[158]
XMedBench
×
Multi-choice QA
ACC
en,zh,fr,es,ar,hi
Medical mT5[160]
-
×
Seqence labeling
Abstractive QA
F1 score
en, es, it, fr
Table 8: An overview of the existing cross-lingual medical benchmarks. For the Languages col-
umn, en, ar, zh, fr, de, pt, ru, es, ja, and hi represent English, Arabic, Chinese, French, German,
Portuguese, Russian, Spanish, Japanese, Hindi, and Italian.
Licensing Examination. A common practice to adapt LLMs to the medical domain is to continu-
ally train the foundation model with domain corpus as introduced in Section 3.2 [26]. For instance,
some models such as BioGPT [26], ClinicalGPT [442], PMC-LLaMA [443] and MedAlpaca [444]
have been progressively fine-tuned foundation models on the medical related corpus, achieving dra-
matic medical performance enhancement over the original foundation model. In particular, Chat-
Doctors [445] resembles more of a multidisciplinary doctor, built on mixed data instead of solely
medical data, capable of conducting patient-doctor dialogues, focusing on comprehensive inquiry
services in the real-world scenario. In addition, in the realm of traditional Chinese medicine, Hu-
aTuoGPT2 [446] that is fine-tuned on the Baichuan [44] with four types of data (distilled instruc-
tions/conversations from ChatGPT [1] and real-world instructions/conversations from doctors) and
capable of mimicking the diagnostic abilities of doctors provides useful medical information. The
experimental results demonstrate the capabilities of HuaTuoGPT2 surpassing those of the GPT-4 [2]
in the 2023 national medical licensing examination of traditional Chinese medicine. However, the
aforementioned models primarily focus on a limited set of high-resource languages and show vary-
ing degrees of performance degradation when extended to other languages. Such a phenomenon
renders them unreliable, incapable, and insecure for application in linguistically diverse medical
environments.
7.1.1
Medical LLMs in Multilingual Scenarios
To alleviate the issue of multilingualism in the medical domain, prior studies attempt to introduce
multilingual medical corpus to enhance the multilingual ability of foundation models as shown in
Table 7 and Table 8, Specifically, KBioXLM [155] adapts XLM-R [447] to the medical domain,
which encompasses diverse medical knowledge. However, KBioXLM explores both the training
corpus and evaluation data through translation, adapted to only two languages. To further address
the limited availability of data beyond English, L2M3 [159] integrates Meditron-70B with the Meta
SeamlessM4T machine translation system and separately fine-tune two components on four ex-
tremely low-resource languages. Garcia et al. [160] explore the medical LLM on encoder-decoder
architecture based on mT5[31]. In the monolingual setting, both in-context learning (ICL) and
SFT demonstrate considerable improvements compared to the foundation models [444, 443, 440].
MMedLM2 [157] underscores medical multilingualism by presenting a 25.5B massive cross-lingual
training corpus covering a set of 6 languages. By training with this corpus, the multilingual abil-
ity of the model improves in all 6 languages, substantially surpassing the prior models and even
rivaling GPT-3.5 and Gemini-1.0-pro. Meanwhile, to further assess the multilingual generalization
of medical LLMs, BioMistral [156] introduces the first large-scale multilingual medical benchmark
of LLMs into 7 languages. Similar to MMedLM2 [157], the Apollo [158] introduces a training
dataset “Apollo Corpora”, a benchmark “XMedBench” and a collection of models ranging from
0.5B to 7B. To investigate the effectiveness of LLMs in the multilingual medical domain, they build
a benchmark “XMedBench”. The comparison on the XMedBench demonstrates that prior multilin-
gual medical LLMs are limited by the PubMed-Central corpus which is constructed based on the
translation technique. To alleviate the issue of training data, they propose a training corpus “Apollo
Corpora” which is rich with high-quality medical knowledge in each language. The corpus is metic-
ulously collected from the local language and strictly prohibits any form of translation. As a result,
the Apollo-7B is fine-tuned on the “Apollo Corpora” and can achieve better performance compared
with prior multilingual medical LLMs with 70B parameters.
21
Categories
Details
Component
Pile of Law(292 GB), Eurlex Resources2 (179 GB), Native Multi Legal Pile (112 GB), Legal MC43 (106 GB)
Text Type Distribution
case law(51.4%), legal-mc4(16.6%), legislation(12.6%), contracts(9.23%), other(10.2%)
Top 5 Languages
Portuguese(15.93%), German(6.29%), Spanish(6.1%), French(3.32%), Italian(2.92%)
Last 5 Languages
Maltese(0.43%), Lithuanian(0.43%), Latvian(0.42%), Croatian(0.3%), Irish(0.08%)
Non-English proportion
48.27%
Total Words
86.36B
Table 9: The proportion of different languages in MultiLegalPile (689GB multilingual legal corpus).
7.1.2
Discussion and Challenges
Existing studies achieve remarkable progress in medical LLMs for the multilingual scenario,
yet numerous challenges are perverse.
First, given the presence of language-specific knowl-
edge that is highly pertinent to the local cultural, historical, political, and regional backgrounds,
Wang et al. [158] examine whether these language-specific medical knowledge stimulates or de-
teriorates with each other and investigate whether the model always outperforms its counterpart
trained solely on the monolingual language corpus when further trained on the whole multilingual
corpus. For instance, the ability of the Spanish model trained in 6 languages surpasses that of
a model only trained on a monolingual corpus in Spanish. Despite underlying conflicts between
different language-specific medical knowledge and potential biases due to varying data, the perfor-
mance boost suggests that cross-lingual joint training promotes the performance of medical LLMs,
shedding light on the potential of cross-lingual pre-training. Thus, further exploration into the effec-
tiveness of the real-world and pseudo data is yet to be undertaken.
Second, the ongoing scarcity of medical data in various languages persistently hampers further ad-
vancement. Although translation can mitigate some of these issues, it may not be effective due to the
complex medical terminology and challenges in precise translation. Moreover, each language might
carry unique cultural and contextual differences, resulting in abundant language-specific medical
knowledge intricately linked to cultural, historical, political, and regional backgrounds. For exam-
ple, traditional Chinese medicine embodies a rich history deeply intertwined with its cultural her-
itage, constituting a distinct medical system. Enabling our systems to grasp such language-specific
medical knowledge and provide tailored medical assistance for specific groups poses a formidable
challenge. Hence, exploring the underlying mechanism of language-specific medical knowledge
integration is a promising research direction.
7.2
Legal Domain
7.2.1
Legal LLMs in Multilingual Scenarios
Similar to the medical domain, the applications of LLMs in the legal domain principally center on
English. Several precedent attempts such as Chatlaw [436], Lawyer LLaMA [448], SaulLM [449],
and LegalBERT [450] expand the general ability of LLMs to the legal domain. The universal per-
formance degradation has been observed when expanding to other languages.
To address the specific problems in the legal domain, the proposed models need to adapt the le-
gal features, which are factual, ambiguous, structured, and timely [451, 452], compared to other
domains. Brugger et al. [162] take a preliminary step in the multilingual legal Sentence Bound-
ary Detection (SBD) covering 6 languages. Christen et al. [163] conduct similar research on the
multilingual Negative Scope Resolution (detecting words affected by negation cue) task and Baum-
gartner et al. [164] extend legal judgment prediction to German, French and Italian. Furthermore,
for a comprehensive evaluation, Niklaus et al. [161] collect 11 natural language understanding le-
gal datasets covering a total of 24 languages and 8 subdivisions, which is the first cross-lingual legal
benchmark (LEXTREME) showing there is still improvement room even for the popular models like
ChatGPT. After the ChatGPT series models were proposed, Nguyen et al. [453] implement a prelim-
inary empirical comparison between ChatGPT and GPT-4 on the “COLIEE” benchmark [454, 455]
encompassing Japanese and English, where GPT-4 consistently surpasses its predecessor but still
falls behind human performance.
For a more in-depth exploration of LLMs in multilingual legal issues, Niklaus et al. [165] construct
a multilingual legal-domain corpus with 689GB, MultiLegalPile, whose detail is shown in Table 9.
They train two PLMs based on XLM-R [447] and the Longformer [322] with this corpus, achieving
22
the state-of-the-art performance on the LEXTREME [161] compared to XLM-R in most languages.
Moreover, the English version of the model achieves state-of-the-art performance on 5 out of 7
tasks in LexGLUE [456], underscoring the exceptional cross-lingual ability and legal-domain ex-
pertise. Trautmann et al. [167] focus on employing legal prompt engineering (LPE) to enhance the
capabilities of LLMs, thereby mitigating the challenges posed by the scarcity of cross-lingual legal
data and the substantial computational resources required. Although improvements over baselines
are observed, bridging the performance gap to match the supervised methods remains a significant
endeavor.
7.2.2
Discussion and Challenges
Despite current efforts, there is still a lack of robust LLMs capable of effectively and comprehen-
sively performing law-related multilingual tasks, highlighting the need for further exploration in
this domain. Beyond the issue of data scarcity, the accumulation of language-specific legal knowl-
edge compounds the complexity, as legal systems and jurisdictions vary significantly across regions.
Given that existing LLMs already struggle with representing semantic features in low-resource
languages, accurately capturing legal nuances across diverse jurisdictions poses an even greater
challenge. Moreover, the temporal dimension adds complexity, as laws undergo constant revision,
amendment, or abolition, necessitating that models remain continuously updated.
7.3
Limitations and Future Directions on Multi-Domain
Despite the remarkable advancements in multilingual LLMs, persistent limitations and challenges
necessitate further exploration. This survey provides a brief discussion of the current limitations and
potential improvement in the following two parts.
Data scarcity and translation issues. A powerful multilingual LLM, especially in specific do-
mains, is predominantly hindered by the scarcity of domain data. Although knowledge transfer pro-
vides some relief, the issue of under-representation persists, particularly for low-resource languages,
and becomes further compounded when extending to specific domains. Machine translation tech-
niques offer a potential solution to mitigate this issue, however, they lead to new challenges [457].
On one hand, machine translation systems introduce errors, particularly when handling domain-
specific terminology across multiple languages. Terms or phrases that native speakers do not use
may also be included in the translated corpus. On the other hand, the models suffer from compre-
hensively understanding and accounting for the local and cultural context of the target language,
complicating the task of in-depth and high-level feature learning and capturing.
Language-Specific knowledge integration In specific contexts such as the legal or financial do-
main, each language harbors distinctive knowledge influenced by diverse historical, cultural, and
regional backgrounds. Beyond linguistic semantics, the challenge arises in capturing these nuances
among various languages and integrating language-specific domain knowledge into LLMs. For ex-
ample, disparities in legal definitions between European Council and USA jurisdictions, as well as
the contrast between traditional Chinese medicine and Western medicine, indicate these challenges.
Current LLMs face challenges in effectively understanding such language-specific knowledge, hin-
dering their capacity to provide customized domain-specific assistance for diverse populations. Fur-
ther research is necessary to explore how LLMs can integrate and leverage this particular type of
knowledge.
These limitations highlight the need for further research efforts in the following directions:
• Development of strategies to construct high-quality, domain-specific multilingual datasets
that preserve cultural context.
• Exploration of techniques for LLMs to effectively integrate and leverage language-specific
in-domain knowledge.
By addressing these two challenges, researchers can pave the way for the development of truly robust
and equitable LLMs that serve a global audience in multilingual scenarios.
23
Name
Release Time
Languages
Size
Sources
Affiliation
Amazon intent [168]
2022
49
2.02 GB
Amazon
Amazon
Amazon reviews [169]
2020
6
-
Amazon
Amazon
Aya [170]
2024
114
156 GB
Mixed
Cohere
Bactrian-x [171]
2023
51
-
-
MBZUAI
Biblenlp [172]
2024
861
581 MB
Bible
-
Bloom-lm [18]
2022
364
-
-
SIL International
CC100 [173] [174]
2020
109
185 GB
CC
Facebook
CulturaX [175]
2023
167
27 TB
mC4, OSCAR
University of Oregon
GPT-4 Prompts [176]
2024
5
1.05 GB
GPT-4
-
Guanaco [177]
2023
4
400 MB
-
University of Washington
HPLT [178]
2023
75
22 TB
CC, Internet Archive
HPLT project
IWSLT 2017 [179]
2017
10
4.24 GB
TED Talks
FBK
mC4 [180]
2019
101
9.7 TB
CC
Google
Mewsli-x [181]
2021
50
285 MB
WikiNews and Wikipedia
DeepMind
Minds14 [182]
2021
12
471 MB
Banking Assistant
PolyAI Limited
MLDR [184]
2024
13
-
Wikipeida, Wudao, mC4
BAAI
MMedC [185]
2024
6
105 GB
Multiple
SJTU
MQA [186]
2021
36
122 GB
CC
CLiPS Research
Multi-sentiments [187]
2022
12
141 MB
Multiple Sources
-
Multiconer [188] [189]
2023
12
338 MB
Wikipedia
Amazon
Open Subtitles [191]
2023
58
273 MB
Subtitles
-
OSCAR [192]
2020
166
6.3 TB
CC
University of Orego
Para-pat [193]
2020
15
2.57 GB
Google Cloud
University of Sheffield
Project Gutenberg [194]
2023
11
14.4 GB
eBook
Project Gutenberg
ShareGPT [195]
2023
5
1.08 GB
GPT / Human
Ronso
SREDFM [196]
2023
18
8.29 GB
Wikidata, Wikipedia
Babelscape
TED Talks [197]
2018
55
-
TED Talks
CMU
TED-talks-iwslt [198]
2012
104
25 GB
TED Talks
FBK
Toxi-text [199]
2023
55
1.96 GB
-
-
UD [200]
2023
102
2.19 GB
-
Universal Dependencies
Wikiann [201] [202]
2019
173
143 MB
Wikipedia
RPI
Wikipedia [203]
2024
322
71.8 GB
Wikipedia
Wikimedia Foundation
Wit Base [204]
2021
105
5.15 GB
Wikipedia
Google
xP3 [205]
2022
277
-
-
Cohere For AI
Table 10: An overview and statistic detail of the representative multilingual data resource. We only
include the large-size datasets with much more supported languages.
8
Multilingual Data Resource
LLMs are data-driven, thus the impressive learning capabilities of LLMs stem from their massive
model sizes and extensive training datasets, which have been proven in high-resource languages.
However, English stands as the closest approximation to the lingua franca, wielding dominance
across various domains. With the largest number of total speakers, its prominence extends far and
wide [458], where English reigns as the primary language of the internet [459, 460]. Meanwhile,
English is the main language used in the higher economic status countries of the world, such as
America, Britain, and other Western countries [461]. Therefore, existing data resources focus on the
English-centric, which came at the expense of regional and indigenous languages, exacerbating lan-
guage endangerment and economic marginalization [462]. Due to the lack of resources, this situation
deeply restricts the development of multilingual models, and it is a vicious circle [463]. Moreover,
low-resource languages suffer from lower quality, due to mislabeling or inadequate representation
of native usage. This situation is especially prevalent with web-crawled data which predominantly
consists of pornographic, nonsensical, or non-linguistic content [464].
As shown in Table 10, we collect as much large-scale multilingual data resource as is reliable.
We can observe that the scale of existing multilingual resources is much smaller than that of En-
glish monolingual resources (only four datasets with the TB level). And the low-/medium-resource
languages typically derive data from a narrower range of sources compared to their high-resource
counterparts [465]. The available data mainly originates from sources, such as Wikipedia, the Bible,
and Common Crawl. In addition, these data suffer from bias and fairness, which we will present
in Section 10. For instance, a gender bias exists in Wikipedia, with studies revealing a persistently
low percentage of women editing articles [466]. The vicious circle of multilingual data includes
the issue of open source issues. Due to the high cost of high-quality multilingual resources, re-
searchers and companies are reluctant to share resources in the open-resource community (i.e., “data
island”) [467, 468, 469, 470]. This situation results in multilingual research staying at the data level
24
and ignoring the competition in the model paradigm. The united governments, companies, and
researchers must start a virtuous cycle of multilingual data resources. Access to abundant, metic-
ulously collected datasets in a language empowers researchers and developers to construct models
and benchmarks. The abundance of models and benchmarks, in turn, fosters increased publication,
facilitates communication, and promotes real-world application scenarios for companies. These out-
puts have the potential to attract more users, while government-mandated guidelines help generate
non-toxic data, which can be repurposed for further research and development.
9
Multilingual Benchmark and Evaluation
With the emergence of novel models and algorithms, researchers inevitably scrutinize the capabili-
ties by evaluating their performance on specific and challenging tasks [473]. Recently, LLMs have
garnered significant interest in the academia and industry. The remarkable performance of LLMs
has been proven on a variety of tasks, showing strong universality compared with prior PLMs lim-
ited to specific tasks. As shown in Table 11, to the best of our knowledge, we list the representative
multilingual benchmarks after 2018 in which mBERT [271] was proposed. From the statistical re-
sults, we can observe many kinds of existing benchmarks, but there remain some issues with these
benchmarks described as follows.
• Lack of task types. Most of the multilingual benchmarks focus on understanding tasks
and lack generation tasks that mainly consist of machine translation and summarization.
However, LLMs are generative paradigms, and generation tasks closer to the real world
should be introduced to evaluate the effectiveness of LLMs in multilingual scenarios. In
addition, the evaluation dimensions of LLMs need to be richer today, and there is a lack of
evaluation tasks for LLMs, such as safety, agents, social simulation, etc.
• Language culture and domain. Existing multilingual benchmarks often rely on machine-
translated text, which may contain errors or terms not commonly used by native language
speakers. The benchmark of native usage with language culture habits is urgently required.
Besides, the challenges within different language environments vary significantly, necessi-
tating a thorough exploration of multilingual and multi-domain issues.
• Unified framework. The number of benchmarks is sufficient but there is a lack of an authori-
tative and unified evaluation framework, which can be updated over time, and the evaluation
aspect is more comprehensive based on the proposed framework. This phenomenon can be
attributed to the dominance of English and individuals’ focus on their native languages. To
address this issue, collaborative efforts from the multilingual community are essential.
• Data leakage. The main differences between LLMs lie in the training data and model size.
The existing systems primarily prioritize real focus on user experience (open test), rather
than assessing effectiveness through closed test sets that align with fair training data. Thus,
there is a potential for data leakage as models may have inadvertently learned from the test
set, especially the closed LLMs. It requires the evaluation methods to adopt a more secure
strategy to reduce the risk of data leakage.
• Evaluation methods. There are limitations in existing evaluation methods, particularly in
generating tasks such as BLEU and ROUGE, thus manual evaluation is more reliable than
automatic evaluation. However, due to the diversity of multilingual tasks, performing man-
ual evaluation requires numerous language experts, which leads to increased costs and
makes it challenging to achieve multilingual tasks. Therefore, reliable automatic evaluation
methods are needed, which would also advance the development of evaluation techniques.
10
Bias and Fairness
10.1
Bias Categories
The bias of LLMs in the multilingual scenario can be divided into two categories: language bias and
demographic bias [28]. Intuitively, the former is due to the imbalance of available training corpus
for different languages [43, 457], where English possesses the most text corpus [462, 474, 475,
476], resulting in the performance degradation of the LLMs when generalized to other language
settings [477, 478]. The demographic bias occurs due to embedded biases and misinformation
25
Name
Release Time
Languages
Parallel
Type
Affiliation
M-Hellaswag [220]
2023
35
✓
Commonsense NLI
University of Oregon
XNLI [256]
2018
15
✓
NLI
NYU
Multilingual-Fig-QA [235]
2023
7
×
NLI
CMU
NoMIRACL [190] [82]
2023
16
×
RAG
University of Waterloo
MIRAGE-Bench [471]
2024
19
×
RAG
University of Waterloo
Cross-Sum [211]
2021
45
✓
Summarization
BUET
XL-SUM [255]
2021
44
×
Summarization
BUET
Pmindiasum [240]
2023
14
✓
Summarization
IIIT Hyderabad
SEAHORSE [242]
2023
6
×
Summarization
DeepMind
M3LS [222]
2023
20
×
Summarization
IITs
BELEBELE [208]
2023
122
✓
Question Answering
Meta
BioInstructQA [209]
2024
7
✓
Question Answering
Avignon Université
MLQA [231]
2020
7
✓
Question Answering
Facebook
TyDiQA [248]
2020
11
×
Question Answering
Google
XOR-TyDi [386]
2021
11
×
Question Answering
University of Washington
XQuAD [257]
2020
10
✓
Question Answering
University of the Basque Country
MaXM [227]
2023
7
✓
Visual Question Answering
Google
CIRAL [393]
2024
4
×
Information Retrieval
University of Waterloo
MIRACL [183]
2023
18
-
Information Retrieval
University of Waterloo
LAReQA [472]
2020
11
✓
Information Retrieval
Google Research
STSB-multi-mt [245]
2021
10
✓
Text Similarity
-
MasakhaNER [224]
2021
10
✓
Named Entity Recognition
Masakhane
Multi-CoNER [233]
2022
11
×
Named Entity Recognition
Amazon
XCOPA [251]
2020
12
✓
Commonsense Reasoning
Cambridge University
XCSQA [252]
2021
11
✓
Commonsense Reasoning
USC
XStoryCloze [38]
2022
11
✓
Commonsense Reasoning
Meta
XWinograd [261]
2021
6
×
Commonsense Reasoning
Yandex
XCSR [262]
2021
16
✓
Commonsense Reasoning
USC
FLORES-200 [215] [216] [217]
2022
200
✓
Machine Translation
Meta
OPUS-100 [238]
2020
100
✓
Machine Translation
University of Edinburgh
Tatoeba-mt [246]
2020
93
✓
Machine Translation
Tatoeba.org
Humaneval-XL [219]
2024
23
✓
Code Generation
University of Copenhagen
ODEX [237]
2022
14
✓
Code Generation
CMU
MARC [223]
2020
6
×
Text Classification
Amazon
Masakhanews [225]
2023
16
×
News Topic Classification
Masakhane
MULTIEURLEXDOC [234]
2021
23
✓
Legal Topic Classification
University of Copenhagen
Sib200 [243]
2024
205
✓
Topic Classification
UCL
Afrisent [206]
2023
14
×
Sentiment Analysis
U.Porto
ASPEN [207]
2022
31
✓
Story Planning
Cambridge University
Crossmodal-3600 [212]
2022
36
✓
Image Captioning
Google
Exams [213]
2020
15
✓
Examination
Sofia University
Fairlex [214]
2022
5
×
Fairness
University of Copenhagen
GEOMLAMA [218]
2022
5
✓
Knowledge Diversity
University of California
M-MMLU [220]
2023
35
✓
NLU
University of Oregon
M3Exam [221]
2023
9
×
Examination
DAMO Academy
MASSIVE [226]
2022
51
✓
Intent Recognition, Slot Filling
Amazon
Mela [230]
2022
10
×
Linguistic Acceptability
SJTU
MGSM [66]
2022
11
✓
Mathematical Reasoning
Google
MMedBench [232]
2023
6
×
Medical
SJTU
Paws-X [239]
2019
7
✓
Paraphrase Identification
Google
SMiLER [244]
2021
14
×
Entity and Relation Extraction
Samsung
Tydip [247]
2022
9
×
Identify Politeness Levels
UT-Austin
X-CLAIM [249]
2023
6
×
Realworld Claims
MBZUAI
X-RiSAWOZ [250]
2023
6
✓
Dialogue Utterances
Stanford University
xDial-Eval [253]
2023
10
✓
Dialogues
NUS
PRESTO [241]
2023
6
×
Conversational Parsing
University of Rochester
Universal Dependencies [200]
2022
146
×
Parser
-
XSEMPLR [258]
2023
22
×
Semantic Parsing
PSU
Bucc-bitext-mining [210]
2022
5
×
Mixed
HuggingFace
MEGA [228]
2023
70
×
Mixed
UW
MEGAVerse [229]
2023
83
×
Mixed
Microsoft
NusaX [236]
2023
10
✓
Mixed
Bloomberg
XGLUE [254]
2020
-
×
Mixed
Microsoft
XTREME [259]
2020
40
✓
Mixed
CMU
XTREME-R [260]
2021
50
✓
Mixed
DeepMind
Table 11: An overview of multilingual benchmarks with more than four supported languages after
2018 in which mBERT [271] was proposed. NLU and NLI denote the natural language understand-
ing and the natural language inference task, respectively.
on the internet, leading to LLMs unavoidably inheriting demographic biases across gender, race,
and political backgrounds [479, 480, 481, 482]. This exacerbates existing inequalities, perpetuates
stereotypes, and reinforces discrimination.
The core of multilingual LLM research is to improve the language modeling ability in other
medium/low-resource languages while maintaining competence in English.
Concerning demo-
graphic biases, previous attempts to mitigate bias and align LLMs with human values have primarily
concentrated on English [483, 484, 485]. Consequently, bias and ethical issues persist in other lan-
guages, potentially leading to significant negative impacts for non-English-speaking users.
26
Name
Languages
Type of Bias
Debias Object
Metrics
RTP-LX [486]
28
Bias, Identity attack, Insult
Microaggression, Self-harm
Sexual content, Toxicity, Violence
Small LM
Large LM
Exact Label Match
Interrater Reliability [486]
MGB [487]
zh,en,de,pt,es
Gender Bias
Masked LM
MBE, MGL, LSG, MSG [487]
MIBs [488]
en,es,de,fr
Gender Bias, Occupation Bias
Word Embedding
inBias [488]
MozArt [489]
en,de,es,fr
Gender Bias, Language
Masked LM
Close Test
Table 12: An overview of the multilingual bias evaluation datasets. The 28 languages supported by
RTP-LX are Arabic, Hebrew, Indonesian, Danish, Norwegian, Swedish, Dutch, English, German,
Russian, Ukrainian, Czech, Polish, Serbian, Bosnian, Croatian, Montenegrin, Spanish, Portuguese,
French, Italian, Hindi, Thai, Kiswahili, Chinese, Japanese, Korean, Turkish, Finnish, and Hungarian.
10.2
Multilingual Debias
Language bias of LLMs persists in the multilingual scenario as a consequence of the dominance of
English resources and the insufficiency of other languages on the internet. To enhance the model
ability on low-resource languages, a common practice is to incorporate large-scale data [475, 462]
for training. The extensive training data facilitates language transfer, especially among typologically
similar languages. Furthermore, the strategies such as curriculum learning [43] and up-sampling [38,
37, 156] progressively increase the proportion of non-English resource. These techniques expose
LLMs to a wider range of languages while maximizing the utilization of existing data.
To mitigate demographic bias in the multilingual scenario, Zhao et al. [488] extend word embed-
ding bias to the cross-lingual and Piqueras et al. [489] evaluate group bias of three pre-trained LM
(mBERT, XLM-R, and mT5) on four languages (En, Es, De, and Fr). Besides, Vashishtha et al. [490]
extend debiasing strategies such as counterfactual data augmentation and self-debias to non-English
languages, revealing a greater potential for debiasing and generalization among linguistically similar
languages. However, they only investigate a few Indian languages, without comprehensive mitiga-
tion strategies for broader language groups. For a more comprehensive evaluation, De et al. [486]
introduce RTP-LX, a dataset designed for identifying culture-specific toxic languages with much
wider coverage (28 languages and 8 different classes). Experimental results on up-to-date LLMs
(Mistral [46], Gemma [491], GPT-4 [148], etc) demonstrate that even the popular models still
struggle to judge history or content-dependent toxic content.
Moreover, Lin et al.
[38] and
Shliazhko et al. [37] analyze safety and bias in multilingual PLMs (XGLM and mGPT), respec-
tively. They observe that multilingual PLMs pronounce gender bias in certain occupations, while
few-shot learning has minimal impact on performance improvement. To analyze gender bias ro-
bustly, Yu et al. [487] propose a novel model-based approach to generate sentence pairs. Based on
mBERT [271], Reusens et al. [492] investigate cross-lingual transferability of debias techniques on
4 languages and stimulate cross-lingual debiasing effectiveness with additional pre-training.
10.3
Limitations and Discussion
To mitigate the cross-lingual bias is a promising research question and it has profound implications
for the welfare, fairness, and esteem of numerous social and racial groups. Due to the scarcity of
high-quality data in low-resource languages and the absence of pertinent evaluation benchmarks,
effective bias detection and elimination remain largely unexplored, underscoring the necessity and
imperative for future research. Besides, machine translation can mitigate the issue of low-resource
languages via pseudo data generation [493, 494] but it omits the cultural context or fails to capture
the cultural nuances of a specific language [495]. The local and cultural backgrounds are critical to
prejudice and hate speech. Thus, leveraging raw corpus in the local original context is important for
detecting toxic content by native speakers.
11
Conclusion and Future Directions
In this paper, we summarize the existing representative research efforts on LLMs in the multilingual
scenario from multiple perspectives. We first rethink the transitions between previous and current
research on pre-trained language models. Based on the main aspect, the survey is divided into
several sections from the view of training paradigms, inference strategies, information retrieval, se-
27
curity, multi-domain, data resources, and benchmark evaluation. Besides, we appeal to the research
community for bias and fairness when exploring multilingual models. We also discuss several ur-
gent challenges related to each investigated aspect and provide reflections and potential solutions
for future work. Finally, considering the rapid growth of LLM research, we establish a continu-
ously updated repository to provide relevant literature with the latest advancements of LLMs in the
multilingual scenario.
In conclusion, LLMs have greatly contributed to the advancement of multilingual applications, pro-
gressing toward the goal of user-oriented. However, the existing technologies and algorithms in
various multilingual tasks still fall short of expectations, which makes it difficult to meet practi-
cal standards. Aiming for language-fair AI, extensive research efforts are required to adapt LLMs
for multilingual tasks much more feasible. We summarize the suggestions for both academic and
industry as they build, study, and regulate LLMs as follows:
• Sustainable language adaptation. The limited data resources of various languages restrict
the number of supported languages with the initial model pre-training. An ideal situa-
tion is to use the newly available language data to improve the performance and supported
languages of LLMs. Although mammalian brains could protect previously acquired knowl-
edge through cortical loops to avoid catastrophic forgetting, the neural network models lack
this capability. Therefore, sustainably achieving language adaptation for LLMs is not triv-
ial. The longstanding goal of LLMs with multilingualism is to achieve good performance
among multiple languages for all tasks in an incremental learning paradigm.
• Universal multilingual paradigm.
The existing studies mainly focus on leveraging
parameter-tuning techniques and prompt engineering to explore the potential multilingual
capabilities of LLMs. Aiming for a universal multilingual paradigm based on LLMs, it
is beneficial to investigate the potential mechanisms without additional training to effec-
tively address language-specific issues, such as code-switching, multilingual jailbreaking,
cross-domain adaptation, etc.
• Comprehensive and authoritative evaluation. The majority popular mainly focus on En-
glish and their native languages because of regional and linguistic restrictions, which poses
a challenge in bridging the language barrier. To mitigate the language barrier issue, an
urgent requirement for the multilingual community is to construct a comprehensive and
authoritative benchmark to evaluate the multilingual capabilities of LLMs with various as-
pects, including language culture, multilingual security, multilingual reasoning, domain
knowledge in native languages, etc. This can be achieved by a reasonable combination
of multiple benchmarks or guidelines initiated by linguistic experts from corresponding
language communities.
• Bias impact with multilingualism. Existing LLMs inherit biases from the training cor-
pus because of a lack of feasible data management/processing, which poses generation
risks. Besides, the high proportion of Western languages in the training corpus exacerbates
the bias issues from a culturally insensitive generation aspect. How to enable LLMs to
avoid generating biased/risky content and to possess the ability to generate cultural con-
cepts within different languages are important and meaningful to achieve language-fair
technology.
Acknowledgment
We sincerely thank the valuable feedback from every domain expert, including Junpeng Liu (Dalian
University of Technology, China), Jinsong Su (Xiamen University, China), Deyi Xiong (Tianjin
University, China), and the anonymous others. In particular, Chaoqun Liu (Nanyang Technological
University, Singapore) provides valuable thoughts and contributes part of the implementation of the
multilingual inference strategies.
References
[1] Long Ouyang, Jeffrey Wu, Xu Jiang, Diogo Almeida, Carroll Wainwright, Pamela Mishkin,
Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, et al. Training language mod-
28
els to follow instructions with human feedback. Advances in neural information processing
systems, 35:27730–27744, 2022.
[2] Josh Achiam, Steven Adler, Sandhini Agarwal, Lama Ahmad, Ilge Akkaya, Florencia Leoni
Aleman, Diogo Almeida, Janko Altenschmidt, Sam Altman, Shyamal Anadkat, et al. Gpt-4
technical report. arXiv preprint arXiv:2303.08774, 2023.
[3] Hugo Touvron, Thibaut Lavril, Gautier Izacard, Xavier Martinet, Marie-Anne Lachaux, Tim-
othée Lacroix, Baptiste Rozière, Naman Goyal, Eric Hambro, Faisal Azhar, et al. Llama:
Open and efficient foundation language models. arXiv preprint arXiv:2302.13971, 2023.
[4] Pengfei Liu, Weizhe Yuan, Jinlan Fu, Zhengbao Jiang, Hiroaki Hayashi, and Graham Neubig.
Pre-train, prompt, and predict: A systematic survey of prompting methods in natural language
processing. ACM Computing Surveys, 55(9):1–35, 2023.
[5] Shushen Manakhimova, Eleftherios Avramidis, Vivien Macketanz, Ekaterina Lapshinova-
Koltunski, Sergei Bagdasarov, and Sebastian Möller. Linguistically motivated evaluation of
the 2023 state-of-the-art machine translation: Can chatgpt outperform nmt? In Proceedings
of the Eighth Conference on Machine Translation, pages 224–245, 2023.
[6] Amr Hendy, Mohamed Abdelrehim, Amr Sharaf, Vikas Raunak, Mohamed Gabr, Hi-
tokazu Matsushita, Young Jin Kim, Mohamed Afify, and Hany Hassan Awadalla.
How
good are gpt models at machine translation? a comprehensive evaluation. arXiv preprint
arXiv:2302.09210, 2023.
[7] Jyotsana Khatri, Vivek Srivastava, and Lovekesh Vig.
Can you translate for me? code-
switched machine translation with large language models. In Proceedings of the 13th In-
ternational Joint Conference on Natural Language Processing and the 3rd Conference of
the Asia-Pacific Chapter of the Association for Computational Linguistics (Volume 2: Short
Papers), pages 83–92, 2023.
[8] Zheheng Luo, Qianqian Xie, and Sophia Ananiadou.
Chatgpt as a factual inconsistency
evaluator for abstractive text summarization. arXiv preprint arXiv:2303.15621, 2023.
[9] Jiaan Wang, Yunlong Liang, Fandong Meng, Zengkui Sun, Haoxiang Shi, Zhixu Li, Jinan
Xu, Jianfeng Qu, and Jie Zhou. Is chatgpt a good nlg evaluator? a preliminary study. In
Proceedings of EMNLP Workshop, page 1, 2023.
[10] Frans Sudirjo, Karno Diantoro, Jassim Ahmad Al-Gasawneh, Hizbul Khootimah Azza-
akiyyah, and Abu Muna Almaududi Ausat. Application of chatgpt in improving customer
sentiment analysis for businesses. Jurnal Teknologi Dan Sistem Informasi Bisnis, 5(3):283–
288, 2023.
[11] Georgios Fatouros, John Soldatos, Kalliopi Kouroumali, Georgios Makridis, and Dimosthenis
Kyriazis. Transforming sentiment analysis in the financial domain with chatgpt. Machine
Learning with Applications, 14:100508, 2023.
[12] Tao Fan, Yan Kang, Guoqiang Ma, Weijing Chen, Wenbin Wei, Lixin Fan, and Qiang Yang.
Fate-llm: A industrial grade federated learning framework for large language models. arXiv
preprint arXiv:2310.10049, 2023.
[13] Sagar Goyal, Eti Rastogi, Sree Prasanna Rajagopal, Dong Yuan, Fen Zhao, Jai Chintagunta,
Gautam Naik, and Jeff Ward. Healai: A healthcare llm for effective medical documentation.
In Proceedings of the 17th ACM International Conference on Web Search and Data Mining,
pages 1167–1168, 2024.
[14] Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N Gomez,
Łukasz Kaiser, and Illia Polosukhin. Attention is all you need. Advances in neural informa-
tion processing systems, 30, 2017.
[15] Viet Lai, Nghia Ngo, Amir Pouran Ben Veyseh, Hieu Man, Franck Dernoncourt, Trung Bui,
and Thien Nguyen. Chatgpt beyond english: Towards a comprehensive evaluation of large
language models in multilingual learning. In Findings of the Association for Computational
Linguistics: EMNLP 2023, pages 13171–13189, 2023.
29
[16] Bosheng Ding, Chengwei Qin, Ruochen Zhao, Tianze Luo, Xinze Li, Guizhen Chen, Wen-
han Xia, Junjie Hu, Anh Tuan Luu, and Shafiq Joty. Data augmentation using llms: Data
perspectives, learning paradigms and challenges. arXiv preprint arXiv:2403.02990, 2024.
[17] Wen Yang, Chong Li, Jiajun Zhang, and Chengqing Zong.
Bigtrans: Augmenting large
language models with multilingual translation capability over 100 languages. arXiv preprint
arXiv:2305.18098, 2023.
[18] Teven Le Scao, Angela Fan, Christopher Akiki, Ellie Pavlick, Suzana Ili´c, Daniel Hesslow,
Roman Castagné, Alexandra Sasha Luccioni, François Yvon, Matthias Gallé, et al. Bloom:
A 176b-parameter open-access multilingual language model, 2022.
[19] Wenxuan Wang, Zhaopeng Tu, Chang Chen, Youliang Yuan, Jen-tse Huang, Wenxiang Jiao,
and Michael R Lyu. All languages matter: On the multilingual safety of large language
models. arXiv preprint arXiv:2310.00905, 2023.
[20] Shaolei Zhang, Qingkai Fang, Zhuocheng Zhang, Zhengrui Ma, Yan Zhou, Langlin Huang,
Mengyu Bu, Shangtong Gui, Yunji Chen, Xilin Chen, et al. Bayling: Bridging cross-lingual
alignment and instruction following through interactive translation for large language models.
arXiv preprint arXiv:2306.10968, 2023.
[21] Guan Wang, Sijie Cheng, Xianyuan Zhan, Xiangang Li, Sen Song, and Yang Liu. Openchat:
Advancing open-source language models with mixed-quality data. In The Twelfth Interna-
tional Conference on Learning Representations, 2023.
[22] Yuanchi Zhang, Yile Wang, Zijun Liu, Shuo Wang, Xiaolong Wang, Peng Li, Maosong Sun,
and Yang Liu. Enhancing multilingual capabilities of large language models through self-
distillation from resource-rich languages. arXiv preprint arXiv:2402.12204, 2024.
[23] Tyler A Chang, Catherine Arnett, Zhuowen Tu, and Benjamin K Bergen. When is multilin-
guality a curse? language modeling for 250 high-and low-resource languages. arXiv preprint
arXiv:2311.09205, 2023.
[24] Zihao Li, Yucheng Shi, Zirui Liu, Fan Yang, Ninghao Liu, and Mengnan Du. Quantify-
ing multilingual performance of large language models across languages.
arXiv preprint
arXiv:2404.11553, 2024.
[25] James Kirkpatrick, Razvan Pascanu, Neil Rabinowitz, Joel Veness, Guillaume Desjardins,
Andrei A Rusu, Kieran Milan, John Quan, Tiago Ramalho, Agnieszka Grabska-Barwinska,
et al. Overcoming catastrophic forgetting in neural networks. Proceedings of the national
academy of sciences, 114(13):3521–3526, 2017.
[26] Renqian Luo, Liai Sun, Yingce Xia, Tao Qin, Sheng Zhang, Hoifung Poon, and Tie-Yan
Liu. Biogpt: generative pre-trained transformer for biomedical text generation and mining.
Briefings in bioinformatics, 23(6):bbac409, 2022.
[27] Zhuang Liu, Degen Huang, Kaiyu Huang, Zhuang Li, and Jun Zhao. Finbert: A pre-trained
financial language representation model for financial text mining.
In Proceedings of the
twenty-ninth international conference on international joint conferences on artificial intel-
ligence, pages 4513–4519, 2021.
[28] Yuemei Xu, Ling Hu, Jiayi Zhao, Zihan Qiu, Yuqi Ye, and Hanwen Gu. A survey on multilin-
gual large language models: Corpora, alignment, and bias. arXiv preprint arXiv:2404.00929,
2024.
[29] Libo Qin, Qiguang Chen, Yuhang Zhou, Zhi Chen, Yinghui Li, Lizi Liao, Min Li, Wanxiang
Che, and Philip S Yu. Multilingual large language model: A survey of resources, taxonomy
and frontiers. arXiv preprint arXiv:2404.04925, 2024.
[30] Tom Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared D Kaplan, Prafulla Dhari-
wal, Arvind Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, et al. Language
models are few-shot learners. Advances in neural information processing systems, 33:1877–
1901, 2020.
30
[31] Linting Xue, Noah Constant, Adam Roberts, Mihir Kale, Rami Al-Rfou, Aditya Siddhant,
Aditya Barua, and Colin Raffel. mt5: A massively multilingual pre-trained text-to-text trans-
former. arXiv preprint arXiv:2010.11934, 2020.
[32] Linting Xue, Aditya Barua, Noah Constant, Rami Al-Rfou, Sharan Narang, Mihir Kale,
Adam Roberts, and Colin Raffel. Byt5: Towards a token-free future with pre-trained byte-
to-byte models. Transactions of the Association for Computational Linguistics, 10:291–306,
2022.
[33] Jack W Rae, Sebastian Borgeaud, Trevor Cai, Katie Millican, Jordan Hoffmann, Fran-
cis Song, John Aslanides, Sarah Henderson, Roman Ring, Susannah Young, et al. Scal-
ing language models: Methods, analysis & insights from training gopher. arXiv preprint
arXiv:2112.11446, 2021.
[34] Romal Thoppilan, Daniel De Freitas, Jamie Hall, Noam Shazeer, Apoorv Kulshreshtha,
Heng-Tze Cheng, Alicia Jin, Taylor Bos, Leslie Baker, Yu Du, et al. Lamda: Language
models for dialog applications. arXiv preprint arXiv:2201.08239, 2022.
[35] Susan Zhang, Stephen Roller, Naman Goyal, Mikel Artetxe, Moya Chen, Shuohui Chen,
Christopher Dewan, Mona Diab, Xian Li, Xi Victoria Lin, et al.
Opt: Open pre-trained
transformer language models. arXiv preprint arXiv:2205.01068, 2022.
[36] Aakanksha Chowdhery, Sharan Narang, Jacob Devlin, Maarten Bosma, Gaurav Mishra,
Adam Roberts, Paul Barham, Hyung Won Chung, Charles Sutton, Sebastian Gehrmann, et al.
Palm: Scaling language modeling with pathways. Journal of Machine Learning Research, 24
(240):1–113, 2023.
[37] Oleh Shliazhko, Alena Fenogenova, Maria Tikhonova, Vladislav Mikhailov, Anastasia Ko-
zlova, and Tatiana Shavrina.
mgpt: Few-shot learners go multilingual.
arXiv preprint
arXiv:2204.07580, 2022.
[38] Xi Victoria Lin, Todor Mihaylov, Mikel Artetxe, Tianlu Wang, Shuohui Chen, Daniel Simig,
Myle Ott, Naman Goyal, Shruti Bhosale, Jingfei Du, et al. Few-shot learning with multi-
lingual generative language models. In Proceedings of the 2022 Conference on Empirical
Methods in Natural Language Processing, pages 9019–9052, 2022.
[39] Xiaozhe Ren, Pingyi Zhou, Xinfan Meng, Xinjing Huang, Yadao Wang, Weichao Wang,
Pengfei Li, Xiaoda Zhang, Alexander Podolskiy, Grigory Arshinov, et al. Pangu: Towards
trillion parameter language model with sparse heterogeneous computing.
arXiv preprint
arXiv:2303.10845, 10:11–15, 2023.
[40] Stella Biderman, Hailey Schoelkopf, Quentin Gregory Anthony, Herbie Bradley, Kyle
O’Brien, Eric Hallahan, Mohammad Aflah Khan, Shivanshu Purohit, USVSN Sai Prashanth,
Edward Raff, et al. Pythia: A suite for analyzing large language models across training and
scaling. In International Conference on Machine Learning, pages 2397–2430. PMLR, 2023.
[41] Rohan Anil, Andrew M Dai, Orhan Firat, Melvin Johnson, Dmitry Lepikhin, Alexandre Pas-
sos, Siamak Shakeri, Emanuel Taropa, Paige Bailey, Zhifeng Chen, et al. Palm 2 technical
report. arXiv preprint arXiv:2305.10403, 2023.
[42] InternLM Team. Internlm: A multilingual language model with progressively enhanced ca-
pabilities, 2023.
[43] Xiangpeng Wei, Haoran Wei, Huan Lin, Tianhao Li, Pei Zhang, Xingzhang Ren, Mei Li,
Yu Wan, Zhiwei Cao, Binbin Xie, et al. Polylm: An open source polyglot large language
model. arXiv preprint arXiv:2307.06018, 2023.
[44] Aiyuan Yang, Bin Xiao, Bingning Wang, Borong Zhang, Ce Bian, Chao Yin, Chenxu Lv,
Da Pan, Dian Wang, Dong Yan, et al. Baichuan 2: Open large-scale language models. arXiv
preprint arXiv:2309.10305, 2023.
[45] Jinze Bai, Shuai Bai, Yunfei Chu, Zeyu Cui, Kai Dang, Xiaodong Deng, Yang Fan, Wenbin
Ge, Yu Han, Fei Huang, et al. Qwen technical report. arXiv preprint arXiv:2309.16609, 2023.
31
[46] Albert Q Jiang, Alexandre Sablayrolles, Arthur Mensch, Chris Bamford, Devendra Singh
Chaplot, Diego de las Casas, Florian Bressand, Gianna Lengyel, Guillaume Lample, Lucile
Saulnier, et al. Mistral 7b. arXiv preprint arXiv:2310.06825, 2023.
[47] Gemini Team, Rohan Anil, Sebastian Borgeaud, Yonghui Wu, Jean-Baptiste Alayrac, Jiahui
Yu, Radu Soricut, Johan Schalkwyk, Andrew M Dai, Anja Hauth, et al. Gemini: a family of
highly capable multimodal models. arXiv preprint arXiv:2312.11805, 2023.
[48] Ye Chen, Wei Cai, Liangmin Wu, Xiaowei Li, Zhanxuan Xin, and Cong Fu. Tigerbot: An
open multilingual multitask llm. arXiv preprint arXiv:2312.08688, 2023.
[49] Yin Luo, Qingchao Kong, Nan Xu, Jia Cao, Bao Hao, Baoyu Qu, Bo Chen, Chao Zhu,
Chenyang Zhao, Donglei Zhang, et al. Yayi 2: Multilingual open-source large language
models. arXiv preprint arXiv:2312.14862, 2023.
[50] Xiao Bi, Deli Chen, Guanting Chen, Shanhuang Chen, Damai Dai, Chengqi Deng, Honghui
Ding, Kai Dong, Qiushi Du, Zhe Fu, et al. Deepseek llm: Scaling open-source language
models with longtermism. arXiv preprint arXiv:2401.02954, 2024.
[51] Du Chen, Yi Huang, Xiaopu Li, Yongqiang Li, Yongqiang Liu, Haihui Pan, Leichao Xu,
Dacheng Zhang, Zhipeng Zhang, and Kun Han. Orion-14b: Open-source multilingual large
language models. arXiv preprint arXiv:2401.12246, 2024.
[52] Marah Abdin, Sam Ade Jacobs, Ammar Ahmad Awan, Jyoti Aneja, Ahmed Awadallah,
Hany Awadalla, Nguyen Bach, Amit Bahree, Arash Bakhtiari, Harkirat Behl, et al. Phi-3
technical report: A highly capable language model locally on your phone. arXiv preprint
arXiv:2404.14219, 2024.
[53] AI Anthropic. The claude 3 model family: Opus, sonnet, haiku. Claude-3 Model Card, 2024.
[54] Zheng Cai, Maosong Cao, Haojiong Chen, Kai Chen, Keyu Chen, Xin Chen, Xun Chen,
Zehui Chen, Zhi Chen, Pei Chu, et al.
Internlm2 technical report.
arXiv preprint
arXiv:2403.17297, 2024.
[55] AI@Meta.
Llama 3 model card, 2024.
URL https://github.com/meta-llama/llama3/blob/
main/MODEL_CARD.md.
[56] Hyung Won Chung, Le Hou, Shayne Longpre, Barret Zoph, Yi Tay, William Fedus, Yunxuan
Li, Xuezhi Wang, Mostafa Dehghani, Siddhartha Brahma, et al. Scaling instruction-finetuned
language models. Journal of Machine Learning Research, 25(70):1–53, 2024.
[57] Aohan Zeng, Xiao Liu, Zhengxiao Du, Zihan Wang, Hanyu Lai, Ming Ding, Zhuoyi Yang,
Yifan Xu, Wendi Zheng, Xiao Xia, et al. Glm-130b: An open bilingual pre-trained model.
arXiv preprint arXiv:2210.02414, 2022.
[58] Rohan Taori, Ishaan Gulrajani, Tianyi Zhang, Yann Dubois, Xuechen Li, Carlos Guestrin,
Percy Liang, and Tatsunori B Hashimoto. Stanford alpaca: An instruction-following llama
model, 2023.
[59] Wenxiang Jiao, Jen-tse Huang, Wenxuan Wang, Zhiwei He, Tian Liang, Xing Wang, Shum-
ing Shi, and Zhaopeng Tu. Parrot: Translating during chat using large language models tuned
with human translation and feedback. In Findings of the Association for Computational Lin-
guistics: EMNLP 2023, pages 15009–15020, 2023.
[60] Wei-Lin Chiang, Zhuohan Li, Zi Lin, Ying Sheng, Zhanghao Wu, Hao Zhang, Lianmin
Zheng, Siyuan Zhuang, Yonghao Zhuang, Joseph E Gonzalez, et al. Vicuna: An open-source
chatbot impressing gpt-4 with 90%* chatgpt quality. See https://vicuna. lmsys. org (accessed
14 April 2023), 2(3):6, 2023.
[61] ZHIPU. Zhipu ai devday glm-4, 2024.
32
[62] Ahmet Üstün, Viraat Aryabumi, Zheng Yong, Wei-Yin Ko, Daniel D’souza, Gbemileke
Onilude, Neel Bhandari, Shivalika Singh, Hui-Lee Ooi, Amr Kayid, Freddie Vargus, Phil
Blunsom, Shayne Longpre, Niklas Muennighoff, Marzieh Fadaee, Julia Kreutzer, and Sara
Hooker. Aya model: An instruction finetuned open-access multilingual language model. In
Lun-Wei Ku, Andre Martins, and Vivek Srikumar, editors, Proceedings of the 62nd Annual
Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pages
15894–15939, Bangkok, Thailand, August 2024. Association for Computational Linguistics.
doi: 10.18653/v1/2024.acl-long.845. URL https://aclanthology.org/2024.acl-long.845.
[63] Yotam Intrator, Matan Halfon, Roman Goldenberg, Reut Tsarfaty, Matan Eyal, Ehud Rivlin,
Yossi Matias, and Natalia Aizenberg. Breaking the language barrier: Can direct inference out-
perform pre-translation in multilingual llm applications? arXiv preprint arXiv:2403.04792,
2024.
[64] Chaoqun Liu, Wenxuan Zhang, Yiran Zhao, Anh Tuan Luu, and Lidong Bing. Is translation
all you need? a study on solving multilingual tasks with large language models. arXiv preprint
arXiv:2403.10258, 2024.
[65] Haoyang Huang, Tianyi Tang, Dongdong Zhang, Wayne Xin Zhao, Ting Song, Yan Xia, and
Furu Wei. Not all languages are created equal in llms: Improving multilingual capability by
cross-lingual-thought prompting. In Findings of the Association for Computational Linguis-
tics: EMNLP 2023, pages 12365–12394, 2023.
[66] Freda Shi, Mirac Suzgun, Markus Freitag, Xuezhi Wang, Suraj Srivats, Soroush Vosoughi,
Hyung Won Chung, Yi Tay, Sebastian Ruder, Denny Zhou, et al.
Language models are
multilingual chain-of-thought reasoners. arXiv preprint arXiv:2210.03057, 2022.
[67] Seungone Kim, Se Joo, Doyoung Kim, Joel Jang, Seonghyeon Ye, Jamin Shin, and Minjoon
Seo. The cot collection: Improving zero-shot and few-shot learning of language models via
chain-of-thought fine-tuning. In Proceedings of the 2023 Conference on Empirical Methods
in Natural Language Processing, pages 12685–12708, 2023.
[68] Mirac Suzgun, Nathan Scales, Nathanael Schärli, Sebastian Gehrmann, Yi Tay, Hyung Won
Chung, Aakanksha Chowdhery, Quoc Le, Ed Chi, Denny Zhou, et al.
Challenging big-
bench tasks and whether chain-of-thought can solve them. In Findings of the Association for
Computational Linguistics: ACL 2023, pages 13003–13051, 2023.
[69] Linzheng Chai, Jian Yang, Tao Sun, Hongcheng Guo, Jiaheng Liu, Bing Wang, Xiannian
Liang, Jiaqi Bai, Tongliang Li, Qiyao Peng, et al. xcot: Cross-lingual instruction tuning for
cross-lingual chain-of-thought reasoning. arXiv preprint arXiv:2401.07037, 2024.
[70] Ruochen Zhang, Samuel Cahyawijaya, Jan Christian Blaise Cruz, Genta Winata, and Alham
Aji. Multilingual large language models are not (yet) code-switchers. In Proceedings of
the 2023 Conference on Empirical Methods in Natural Language Processing, pages 12567–
12582, 2023.
[71] Fajri Koto, Tilman Beck, Zeerak Talat, Iryna Gurevych, and Timothy Baldwin. Zero-shot
sentiment analysis in low-resource languages using a multilingual sentiment lexicon. arXiv
preprint arXiv:2402.02113, 2024.
[72] Puyuan Peng, Brian Yan, Shinji Watanabe, and David Harwath. Prompting the hidden talent
of web-scale speech models for zero-shot task generalization. In Proceedings of the Annual
Conference of the International Speech Communication Association, INTERSPEECH, vol-
ume 2023, pages 396–400, 2023.
[73] Min Zhang, Limin Liu, Zhao Yanqing, Xiaosong Qiao, Su Chang, Xiaofeng Zhao, Junhao
Zhu, Ming Zhu, Song Peng, Yinglu Li, Yilun Liu, Wenbing Ma, Mengyao Piao, Shimin Tao,
Hao Yang, and Yanfei Jiang. Leveraging multilingual knowledge graph to boost domain-
specific entity translation of ChatGPT.
In Masaru Yamada and Felix do Carmo, editors,
Proceedings of Machine Translation Summit XIX, Vol. 2: Users Track, pages 77–87, Macau
SAR, China, September 2023. Asia-Pacific Association for Machine Translation. URL https:
//aclanthology.org/2023.mtsummit-users.7.
33
[74] Peng Shi, Rui Zhang, He Bai, and Jimmy Lin. XRICL: Cross-lingual retrieval-augmented in-
context learning for cross-lingual text-to-SQL semantic parsing. In Yoav Goldberg, Zornitsa
Kozareva, and Yue Zhang, editors, Findings of the Association for Computational Linguis-
tics: EMNLP 2022, pages 5248–5259, Abu Dhabi, United Arab Emirates, December 2022.
Association for Computational Linguistics. doi: 10.18653/v1/2022.findings-emnlp.384. URL
https://aclanthology.org/2022.findings-emnlp.384.
[75] Sweta Agrawal, Chunting Zhou, Mike Lewis, Luke Zettlemoyer, and Marjan Ghazvininejad.
In-context examples selection for machine translation. In Anna Rogers, Jordan Boyd-Graber,
and Naoaki Okazaki, editors, Findings of the Association for Computational Linguistics:
ACL 2023, pages 8857–8873, Toronto, Canada, July 2023. Association for Computational
Linguistics. doi: 10.18653/v1/2023.findings-acl.564. URL https://aclanthology.org/2023.
findings-acl.564.
[76] Xiaoqian Li, Ercong Nie, and Sheng Liang. From classification to generation: Insights into
crosslingual retrieval augmented icl, 2023.
[77] Xiaoqian Li, Ercong Nie, and Sheng Liang.
Crosslingual retrieval augmented in-context
learning for Bangla. In Firoj Alam, Sudipta Kar, Shammur Absar Chowdhury, Farig Sad-
eque, and Ruhul Amin, editors, Proceedings of the First Workshop on Bangla Language
Processing (BLP-2023), pages 136–151, Singapore, December 2023. Association for Com-
putational Linguistics. doi: 10.18653/v1/2023.banglalp-1.15. URL https://aclanthology.org/
2023.banglalp-1.15.
[78] Genta Indra Winata, Liang-Kang Huang, Soumya Vadlamannati, and Yash Chandarana. Mul-
tilingual few-shot learning via language model retrieval, 2023.
[79] Xavier Garcia, Yamini Bansal, Colin Cherry, George Foster, Maxim Krikun, Fangxiaoyu
Feng, Melvin Johnson, and Orhan Firat. The unreasonable effectiveness of few-shot learning
for machine translation, 2023.
[80] Rita Ramos, Bruno Martins, and Desmond Elliott.
LMCap: Few-shot multilingual im-
age captioning by retrieval augmented language model prompting. In Anna Rogers, Jor-
dan Boyd-Graber, and Naoaki Okazaki, editors, Findings of the Association for Compu-
tational Linguistics: ACL 2023, pages 1635–1651, Toronto, Canada, July 2023. Associa-
tion for Computational Linguistics. doi: 10.18653/v1/2023.findings-acl.104. URL https:
//aclanthology.org/2023.findings-acl.104.
[81] Sunkyoung Kim, Dayeon Ki, Yireun Kim, and Jinsik Lee. Boosting cross-lingual transfer-
ability in multilingual models via in-context learning, 2023.
[82] Nandan Thakur, Luiz Bonifacio, Xinyu Zhang, Odunayo Ogundepo, Ehsan Kamalloo, David
Alfonso-Hermelo, Xiaoguang Li, Qun Liu, Boxing Chen, Mehdi Rezagholizadeh, and Jimmy
Lin. Nomiracl: Knowing when you don’t know for robust multilingual retrieval-augmented
generation, 2024.
[83] Rico Sennrich, Jannis Vamvas, and Alireza Mohammadshahi. Mitigating hallucinations and
off-target machine translation with source-contrastive and language-contrastive decoding.
arXiv preprint arXiv:2309.07098, 2023.
[84] Giorgos Vernikos and Andrei Popescu-Belis.
Don’t rank, combine! combining machine
translation hypotheses using quality estimation. arXiv preprint arXiv:2401.06688, 2024.
[85] Chengpeng Fu, Xiaocheng Feng, Yichong Huang, Wenshuai Huo, Baohang Li, Hui Wang,
Bin Qin, and Ting Liu. Relay decoding: Concatenating large language models for machine
translation. arXiv preprint arXiv:2405.02933, 2024.
[86] Jiali Zeng, Fandong Meng, Yongjing Yin, and Jie Zhou. Teaching large language models to
translate with comparison. In Proceedings of the AAAI Conference on Artificial Intelligence,
volume 38, pages 19488–19496, 2024.
34
[87] Zhiwei He, Tian Liang, Wenxiang Jiao, Zhuosheng Zhang, Yujiu Yang, Rui Wang, Zhaopeng
Tu, Shuming Shi, and Xing Wang.
Exploring human-like translation strategy with large
language models. Transactions of the Association for Computational Linguistics, 12:229–
246, 2024.
[88] Simone Conia, Min Li, Daniel Lee, Umar Minhas, Ihab Ilyas, and Yunyao Li. Increasing
coverage and precision of textual information in multilingual knowledge graphs. In Houda
Bouamor, Juan Pino, and Kalika Bali, editors, Proceedings of the 2023 Conference on Em-
pirical Methods in Natural Language Processing, pages 1612–1634, Singapore, December
2023. Association for Computational Linguistics. doi: 10.18653/v1/2023.emnlp-main.100.
URL https://aclanthology.org/2023.emnlp-main.100.
[89] Luiz Bonifacio, Hugo Abonizio, Marzieh Fadaee, and Rodrigo Nogueira. Inpars: Unsuper-
vised dataset generation for information retrieval. In Proceedings of the 45th International
ACM SIGIR Conference on Research and Development in Information Retrieval, SIGIR ’22,
page 2387–2392, New York, NY, USA, 2022. Association for Computing Machinery. ISBN
9781450387323. doi: 10.1145/3477495.3531863.
URL https://doi.org/10.1145/3477495.
3531863.
[90] Vitor Jeronymo, Luiz Bonifacio, Hugo Abonizio, Marzieh Fadaee, Roberto Lotufo, Jakub Za-
vrel, and Rodrigo Nogueira. InPars-v2: Large language models as efficient dataset generators
for information retrieval, 2023. URL https://arxiv.org/abs/2301.01820.
[91] Hugo Abonizio, Luiz Bonifacio, Vitor Jeronymo, Roberto Lotufo, Jakub Zavrel, and Rodrigo
Nogueira. Inpars toolkit: A unified and reproducible synthetic data generation pipeline for
neural information retrieval, 2023.
[92] Zhuyun Dai, Vincent Y Zhao, Ji Ma, Yi Luan, Jianmo Ni, Jing Lu, Anton Bakalov, Kelvin
Guu, Keith Hall, and Ming-Wei Chang. Promptagator: Few-shot dense retrieval from 8 ex-
amples. In The Eleventh International Conference on Learning Representations, 2023. URL
https://openreview.net/forum?id=gmL46YMpu2J.
[93] Nandan Thakur, Jianmo Ni, Gustavo Hernandez Abrego, John Wieting, Jimmy Lin, and
Daniel Cer.
Leveraging LLMs for synthesizing training data across many languages in
multilingual dense retrieval. In Kevin Duh, Helena Gomez, and Steven Bethard, editors,
Proceedings of the 2024 Conference of the North American Chapter of the Association for
Computational Linguistics: Human Language Technologies (Volume 1: Long Papers), pages
7699–7724, Mexico City, Mexico, June 2024. Association for Computational Linguistics.
doi: 10.18653/v1/2024.naacl-long.426. URL https://aclanthology.org/2024.naacl-long.426.
[94] James Mayfield, Eugene Yang, Dawn Lawrie, Samuel Barham, Orion Weller, Marc Mason,
Suraj Nair, and Scott Miller. Synthetic cross-language information retrieval training data,
2023. URL https://arxiv.org/abs/2305.00331.
[95] Liang Wang, Nan Yang, Xiaolong Huang, Linjun Yang, Rangan Majumder, and Furu Wei.
Improving text embeddings with large language models, 2024. URL https://arxiv.org/abs/
2401.00368.
[96] Jinhyuk Lee, Zhuyun Dai, Xiaoqi Ren, Blair Chen, Daniel Cer, Jeremy R. Cole, Kai Hui,
Michael Boratko, Rajvi Kapadia, Wen Ding, Yi Luan, Sai Meher Karthik Duddu, Gus-
tavo Hernandez Abrego, Weiqiang Shi, Nithi Gupta, Aditya Kusupati, Prateek Jain, Sid-
dhartha Reddy Jonnalagadda, Ming-Wei Chang, and Iftekhar Naim. Gecko: Versatile text em-
beddings distilled from large language models, 2024. URL https://arxiv.org/abs/2403.20327.
[97] Luke Merrick, Danmei Xu, Gaurav Nuti, and Daniel Campos. Arctic-embed: Scalable, effi-
cient, and accurate text embedding models, 2024. URL https://arxiv.org/abs/2405.05374.
[98] Liang Wang, Nan Yang, Xiaolong Huang, Linjun Yang, Rangan Majumder, and Furu Wei.
Multilingual e5 text embeddings: A technical report, 2024. URL https://arxiv.org/abs/2402.
05672.
35
[99] Xin Zhang, Yanzhao Zhang, Dingkun Long, Wen Xie, Ziqi Dai, Jialong Tang, Huan Lin,
Baosong Yang, Pengjun Xie, Fei Huang, Meishan Zhang, Wenjie Li, and Min Zhang. mgte:
Generalized long-context text representation and reranking models for multilingual text re-
trieval, 2024. URL https://arxiv.org/abs/2407.19669.
[100] Jianlv Chen, Shitao Xiao, Peitian Zhang, Kun Luo, Defu Lian, and Zheng Liu. Bge m3-
embedding: Multi-lingual, multi-functionality, multi-granularity text embeddings through
self-knowledge distillation, 2024. URL https://arxiv.org/abs/2402.03216.
[101] New
embedding
models
and
api
updates.
https://openai.com/index/
new-embedding-models-and-api-updates/. Accessed: 2024-01-25.
[102] Introducing embed v3. https://cohere.com/blog/introducing-embed-v3. Accessed: 2023-11-
02.
[103] voyage-multilingual-2: Multilingual embedding model. https://blog.voyageai.com/2024/06/
10/voyage-multilingual-2-multilingual-embedding-model/. Accessed: 2024-06-10.
[104] Xueguang Ma, Liang Wang, Nan Yang, Furu Wei, and Jimmy Lin. Fine-tuning llama for
multi-stage text retrieval. In Proceedings of the 47th International ACM SIGIR Conference
on Research and Development in Information Retrieval, SIGIR ’24, page 2421–2425, New
York, NY, USA, 2024. Association for Computing Machinery. ISBN 9798400704314. doi:
10.1145/3626772.3657951. URL https://doi.org/10.1145/3626772.3657951.
[105] Shengyao Zhuang, Xueguang Ma, Bevan Koopman, Jimmy Lin, and Guido Zuccon.
Promptreps: Prompting large language models to generate dense and sparse representations
for zero-shot document retrieval, 2024. URL https://arxiv.org/abs/2404.18424.
[106] Niklas Muennighoff, Nouamane Tazi, Loïc Magne, and Nils Reimers. Mteb: Massive text
embedding benchmark. arXiv preprint arXiv:2210.07316, 2022. doi: 10.48550/ARXIV.2210.
07316. URL https://arxiv.org/abs/2210.07316.
[107] Chankyu Lee, Rajarshi Roy, Mengyao Xu, Jonathan Raiman, Mohammad Shoeybi, Bryan
Catanzaro, and Wei Ping. Nv-embed: Improved techniques for training llms as generalist
embedding models, 2024. URL https://arxiv.org/abs/2405.17428.
[108] Jacob Mitchell Springer, Suhas Kotha, Daniel Fried, Graham Neubig, and Aditi Raghunathan.
Repetition improves language model embeddings, 2024.
URL https://arxiv.org/abs/2402.
15449.
[109] Parishad BehnamGhader, Vaibhav Adlakha, Marius Mosbach, Dzmitry Bahdanau, Nicolas
Chapados, and Siva Reddy. Llm2vec: Large language models are secretly powerful text
encoders, 2024. URL https://arxiv.org/abs/2404.05961.
[110] Niklas Muennighoff, Hongjin Su, Liang Wang, Nan Yang, Furu Wei, Tao Yu, Amanpreet
Singh, and Douwe Kiela. Generative representational instruction tuning, 2024. URL https:
//arxiv.org/abs/2402.09906.
[111] Aditya Kusupati, Gantavya Bhatt, Aniket Rege, Matthew Wallingford, Aditya Sinha, Vivek
Ramanujan, William Howard-Snyder, Kaifeng Chen, Sham Kakade, Prateek Jain, and Ali
Farhadi. Matryoshka representation learning, 2024. URL https://arxiv.org/abs/2205.13147.
[112] Shitao Xiao, Zheng Liu, Peitian Zhang, and Xingrun Xing. LM-cocktail: Resilient tuning of
language models via model merging. In Lun-Wei Ku, Andre Martins, and Vivek Srikumar,
editors, Findings of the Association for Computational Linguistics ACL 2024, pages 2474–
2488, Bangkok, Thailand and virtual meeting, August 2024. Association for Computational
Linguistics. doi: 10.18653/v1/2024.findings-acl.145. URL https://aclanthology.org/2024.
findings-acl.145.
[113] Sean Lee, Aamir Shakir, Darius Koenig, and Julius Lipp.
Open source strikes
bread - new fluffy embeddings model, 2024.
URL https://www.mixedbread.ai/blog/
mxbai-embed-large-v1.
36
[114] Arkadeep Acharya, Rudra Murthy, Vishwajeet Kumar, and Jaydeep Sen. NLLB-E5: A scal-
able multilingual retrieval model, 2024. URL https://arxiv.org/abs/2409.05401.
[115] Luiz Bonifacio, Vitor Jeronymo, Hugo Queiroz Abonizio, Israel Campiotti, Marzieh Fadaee,
Roberto Lotufo, and Rodrigo Nogueira. mmarco: A multilingual version of the ms marco
passage ranking dataset, 2022. URL https://arxiv.org/abs/2108.13897.
[116] Xinyu Zhang, Nandan Thakur, Odunayo Ogundepo, Ehsan Kamalloo, David Alfonso-
Hermelo, Xiaoguang Li, Qun Liu, Mehdi Rezagholizadeh, and Jimmy Lin. MIRACL: A
Multilingual Retrieval Dataset Covering 18 Diverse Languages.
Transactions of the As-
sociation for Computational Linguistics, 11:1114–1131, 09 2023. ISSN 2307-387X. doi:
10.1162/tacl_a_00595. URL https://doi.org/10.1162/tacl_a_00595.
[117] Suraj Nair, Eugene Yang, Dawn Lawrie, Kevin Duh, Paul McNamee, Kenton Murray, James
Mayfield, and Douglas W. Oard. Transfer learning approaches for building cross-language
dense retrieval models. In Advances in Information Retrieval: 44th European Conference
on IR Research, ECIR 2022, Stavanger, Norway, April 10–14, 2022, Proceedings, Part I,
page 382–396, Berlin, Heidelberg, 2022. Springer-Verlag. ISBN 978-3-030-99735-9. doi:
10.1007/978-3-030-99736-6_26. URL https://doi.org/10.1007/978-3-030-99736-6_26.
[118] Eugene Yang, Dawn Lawrie, James Mayfield, Douglas W. Oard, and Scott Miller. Translate-
distill: Learning cross-language dense retrieval by translation and distillation. In Advances
in Information Retrieval: 46th European Conference on Information Retrieval, ECIR 2024,
Glasgow, UK, March 24–28, 2024, Proceedings, Part II, page 50–65, Berlin, Heidelberg,
2024. Springer-Verlag. ISBN 978-3-031-56059-0. doi: 10.1007/978-3-031-56060-6_4. URL
https://doi.org/10.1007/978-3-031-56060-6_4.
[119] Zhiqi Huang, Puxuan Yu, and James Allan. Improving cross-lingual information retrieval
on low-resource languages via optimal transport distillation.
In Proceedings of the Six-
teenth ACM International Conference on Web Search and Data Mining, WSDM ’23, page
1048–1056, New York, NY, USA, 2023. Association for Computing Machinery.
ISBN
9781450394079. doi: 10.1145/3539597.3570468.
URL https://doi.org/10.1145/3539597.
3570468.
[120] Dawn Lawrie, Eugene Yang, Douglas W. Oard, and James Mayfield. Neural approaches to
multilingual information retrieval. In Advances in Information Retrieval: 45th European Con-
ference on Information Retrieval, ECIR 2023, Dublin, Ireland, April 2–6, 2023, Proceedings,
Part I, page 521–536, Berlin, Heidelberg, 2023. Springer-Verlag. ISBN 978-3-031-28243-0.
doi: 10.1007/978-3-031-28244-7_33. URL https://doi.org/10.1007/978-3-031-28244-7_33.
[121] Eugene Yang, Dawn Lawrie, and James Mayfield. Distillation for multilingual information
retrieval. In Proceedings of the 47th International ACM SIGIR Conference on Research and
Development in Information Retrieval, SIGIR ’24, page 2368–2373, New York, NY, USA,
2024. Association for Computing Machinery. ISBN 9798400704314. doi: 10.1145/3626772.
3657955. URL https://doi.org/10.1145/3626772.3657955.
[122] Antoine Louis, Vageesh Saxena, Gijs van Dijck, and Gerasimos Spanakis. Colbert-xm: A
modular multi-vector representation model for zero-shot multilingual information retrieval,
2024. URL https://arxiv.org/abs/2402.15059.
[123] Jianlyu Chen, Shitao Xiao, Peitian Zhang, Kun Luo, Defu Lian, and Zheng Liu.
M3-
embedding: Multi-linguality, multi-functionality, multi-granularity text embeddings through
self-knowledge distillation.
In Lun-Wei Ku, Andre Martins, and Vivek Srikumar, edi-
tors, Findings of the Association for Computational Linguistics ACL 2024, pages 2318–
2335, Bangkok, Thailand and virtual meeting, August 2024. Association for Computational
Linguistics. doi: 10.18653/v1/2024.findings-acl.137. URL https://aclanthology.org/2024.
findings-acl.137.
[124] Vitor Jeronymo, Roberto Lotufo, and Rodrigo Nogueira. Neuralmind-unicamp at 2022 trec
neuclir: Large boring rerankers for cross-lingual retrieval, 2023. URL https://arxiv.org/abs/
2303.16145.
37
[125] Weiwei Sun, Lingyong Yan, Xinyu Ma, Shuaiqiang Wang, Pengjie Ren, Zhumin Chen, Dawei
Yin, and Zhaochun Ren. Is ChatGPT good at search? investigating large language models
as re-ranking agents.
In Houda Bouamor, Juan Pino, and Kalika Bali, editors, Proceed-
ings of the 2023 Conference on Empirical Methods in Natural Language Processing, pages
14918–14937, Singapore, December 2023. Association for Computational Linguistics. doi:
10.18653/v1/2023.emnlp-main.923. URL https://aclanthology.org/2023.emnlp-main.923.
[126] Xueguang Ma, Xinyu Zhang, Ronak Pradeep, and Jimmy Lin. Zero-shot listwise document
reranking with a large language model, 2023. URL https://arxiv.org/abs/2305.02156.
[127] Shengyao Zhuang, Honglei Zhuang, Bevan Koopman, and Guido Zuccon. A setwise ap-
proach for effective and highly efficient zero-shot ranking with large language models. In
Proceedings of the 47th International ACM SIGIR Conference on Research and Development
in Information Retrieval, SIGIR ’24, page 38–47, New York, NY, USA, 2024. Association
for Computing Machinery. ISBN 9798400704314. doi: 10.1145/3626772.3657813. URL
https://doi.org/10.1145/3626772.3657813.
[128] Ronak Pradeep, Sahel Sharifymoghaddam, and Jimmy Lin. Rankvicuna: Zero-shot listwise
document reranking with open-source large language models, 2023. URL https://arxiv.org/
abs/2309.15088.
[129] Ronak Pradeep, Sahel Sharifymoghaddam, and Jimmy Lin. Rankzephyr: Effective and robust
zero-shot listwise reranking is a breeze!, 2023. URL https://arxiv.org/abs/2312.02724.
[130] Xinyu Zhang, Sebastian Hofstätter, Patrick Lewis, Raphael Tang, and Jimmy Lin. Rank-
without-gpt: Building gpt-independent listwise rerankers on open-source large language
models, 2023. URL https://arxiv.org/abs/2312.02969.
[131] Yiqun Chen, Qi Liu, Yi Zhang, Weiwei Sun, Daiting Shi, Jiaxin Mao, and Dawei Yin. Tour-
rank: Utilizing large language models for documents ranking with a tournament-inspired
strategy, 2024. URL https://arxiv.org/abs/2406.11678.
[132] Mofetoluwa Adeyemi, Akintunde Oladipo, Ronak Pradeep, and Jimmy Lin. Zero-shot cross-
lingual reranking with large language models for low-resource languages, 2023. URL https:
//arxiv.org/abs/2312.16159.
[133] Chawin Sitawarin, Norman Mu, David Wagner, and Alexandre Araujo. Pal: Proxy-guided
black-box attack on large language models, 2024.
[134] Andy Zou, Zifan Wang, J Zico Kolter, and Matt Fredrikson. Universal and transferable ad-
versarial attacks on aligned language models. arXiv preprint arXiv:2307.15043, 2023.
[135] Alexander Wei, Nika Haghtalab, and Jacob Steinhardt. Jailbroken: How does llm safety
training fail? Advances in Neural Information Processing Systems, 36, 2024.
[136] Yi Liu, Gelei Deng, Zhengzi Xu, Yuekang Li, Yaowen Zheng, Ying Zhang, Lida Zhao, Tian-
wei Zhang, and Yang Liu. Jailbreaking chatgpt via prompt engineering: An empirical study.
arXiv preprint arXiv:2305.13860, 2023.
[137] Xinyue Shen, Zeyuan Chen, Michael Backes, Yun Shen, and Yang Zhang. "do anything now":
Characterizing and evaluating in-the-wild jailbreak prompts on large language models, 2023.
[138] Gelei Deng, Yi Liu, Yuekang Li, Kailong Wang, Ying Zhang, Zefeng Li, Haoyu Wang, Tian-
wei Zhang, and Yang Liu.
Masterkey: Automated jailbreaking of large language model
chatbots. In Proc. ISOC NDSS, 2024.
[139] Lijun Li, Bowen Dong, Ruohui Wang, Xuhao Hu, Wangmeng Zuo, Dahua Lin, Yu Qiao,
and Jing Shao. Salad-bench: A hierarchical and comprehensive safety benchmark for large
language models. arXiv preprint arXiv:2402.05044, 2024.
[140] Xiaogeng Liu, Nan Xu, Muhao Chen, and Chaowei Xiao. Autodan: Generating stealthy
jailbreak prompts on aligned large language models. arXiv preprint arXiv:2310.04451, 2023.
38
[141] Haibo Jin, Ruoxi Chen, Andy Zhou, Jinyin Chen, Yang Zhang, and Haohan Wang. Guard:
Role-playing to generate natural-language jailbreakings to test guideline adherence of large
language models. arXiv preprint arXiv:2402.03299, 2024.
[142] Lingfeng Shen, Weiting Tan, Sihao Chen, Yunmo Chen, Jingyu Zhang, Haoran Xu, Boyuan
Zheng, Philipp Koehn, and Daniel Khashabi. The language barrier: Dissecting safety chal-
lenges of llms in multilingual contexts, 2024.
[143] Yue Deng, Wenxuan Zhang, Sinno Jialin Pan, and Lidong Bing. Multilingual jailbreak chal-
lenges in large language models. arXiv preprint arXiv:2310.06474, 2023.
[144] Poorna Chander Reddy Puttaparthi, Soham Sanjay Deo, Hakan Gul, Yiming Tang, Weiyi
Shang, and Zhe Yu. Comprehensive evaluation of chatgpt reliability through multilingual
inquiries, 2023.
[145] Zheng-Xin Yong, Cristina Menghini, and Stephen H Bach. Low-resource languages jailbreak
gpt-4. arXiv preprint arXiv:2310.02446, 2023.
[146] Nan Xu, Fei Wang, Ben Zhou, Bang Zheng Li, Chaowei Xiao, and Muhao Chen. Cogni-
tive overload: Jailbreaking large language models with overloaded logical thinking. arXiv
preprint arXiv:2311.09827, 2023.
[147] Jie Li, Yi Liu, Chongyang Liu, Ling Shi, Xiaoning Ren, Yaowen Zheng, Yang Liu, and
Yinxing Xue. A cross-language investigation into jailbreak attacks in large language models.
arXiv preprint arXiv:2401.16765, 2024.
[148] Youliang Yuan, Wenxiang Jiao, Wenxuan Wang, Jen tse Huang, Pinjia He, Shuming Shi, and
Zhaopeng Tu. Gpt-4 is too smart to be safe: Stealthy chat with llms via cipher, 2024.
[149] Yangsibo Huang, Samyak Gupta, Mengzhou Xia, Kai Li, and Danqi Chen. Catastrophic
jailbreak of open-source llms via exploiting generation. arXiv preprint arXiv:2310.06987,
2023.
[150] Alexander Robey, Eric Wong, Hamed Hassani, and George J Pappas. Smoothllm: Defending
large language models against jailbreaking attacks. arXiv preprint arXiv:2310.03684, 2023.
[151] Andy Zhou, Bo Li, and Haohan Wang. Robust prompt optimization for defending language
models against jailbreaking attacks. arXiv preprint arXiv:2401.17263, 2024.
[152] Neel Jain, Avi Schwarzschild, Yuxin Wen, Gowthami Somepalli, John Kirchenbauer, Ping-
yeh Chiang, Micah Goldblum, Aniruddha Saha, Jonas Geiping, and Tom Goldstein. Base-
line defenses for adversarial attacks against aligned language models.
arXiv preprint
arXiv:2309.00614, 2023.
[153] Daoyuan Wu, Shuai Wang, Yang Liu, and Ning Liu. Llms can defend themselves against
jailbreaking in a practical manner: A vision paper, 2024.
[154] Yuhui Li, Fangyun Wei, Jinjing Zhao, Chao Zhang, and Hongyang Zhang. Rain: Your lan-
guage models can align themselves without finetuning. In The Twelfth International Confer-
ence on Learning Representations, 2023.
[155] Lei Geng, Xu Yan, Ziqiang Cao, Juntao Li, Wenjie Li, Sujian Li, Xinjie Zhou, Yang Yang, and
Jun Zhang. Kbioxlm: A knowledge-anchored biomedical multilingual pretrained language
model. arXiv preprint arXiv:2311.11564, 2023.
[156] Yanis Labrak, Adrien Bazoge, Emmanuel Morin, Pierre-Antoine Gourraud, Mickael Rou-
vier, and Richard Dufour. Biomistral: A collection of open-source pretrained large language
models for medical domains. arXiv preprint arXiv:2402.10373, 2024.
[157] Pengcheng Qiu, Chaoyi Wu, Xiaoman Zhang, Weixiong Lin, Haicheng Wang, Ya Zhang,
Yanfeng Wang, and Weidi Xie. Towards building multilingual language model for medicine.
arXiv preprint arXiv:2402.13963, 2024.
39
[158] Xidong Wang, Nuo Chen, Junyin Chen, Yan Hu, Yidong Wang, Xiangbo Wu, Anningzhe
Gao, Xiang Wan, Haizhou Li, and Benyou Wang. Apollo: Lightweight multilingual medical
llms towards democratizing medical ai to 6b people. arXiv preprint arXiv:2403.03640, 2024.
[159] Agasthya Gangavarapu. Introducing l2m3, a multilingual medical large language model to
advance health equity in low-resource regions. arXiv preprint arXiv:2404.08705, 2024.
[160] Iker García-Ferrero, Rodrigo Agerri, Aitziber Atutxa Salazar, Elena Cabrio, Iker de la Iglesia,
Alberto Lavelli, Bernardo Magnini, Benjamin Molinet, Johana Ramirez-Romero, German
Rigau, et al.
Medical mt5: An open-source multilingual text-to-text llm for the medical
domain. arXiv preprint arXiv:2404.07613, 2024.
[161] Joel Niklaus, Veton Matoshi, Pooja Rani, Andrea Galassi, Matthias Stürmer, Ilias Chalkidis,
et al. Lextreme: A multi-lingual and multi-task benchmark for the legal domain. In Findings
of the Association for Computational Linguistics: EMNLP 2023, pages 3016–3054. Associa-
tion for Computational Linguistics, 2023.
[162] Tobias Brugger, Matthias Stürmer, and Joel Niklaus. Multilegalsbd: A multilingual legal sen-
tence boundary detection dataset. In Proceedings of the Nineteenth International Conference
on Artificial Intelligence and Law, pages 42–51, 2023.
[163] Ramona Christen, Anastassia Shaitarova, Matthias Stürmer, and Joel Niklaus. Resolving
legalese: A multilingual exploration of negation scope resolution in legal documents. arXiv
preprint arXiv:2309.08695, 2023.
[164] Nina Baumgartner, Matthias Stürmer, Matthias Grabmair, Joel Niklaus, et al. Towards ex-
plainability and fairness in swiss judgement prediction: Benchmarking on a multilingual
dataset. arXiv preprint arXiv:2402.17013, 2024.
[165] Joel Niklaus, Veton Matoshi, Matthias Stürmer, Ilias Chalkidis, and Daniel E Ho. Multile-
galpile: A 689gb multilingual legal corpus. arXiv preprint arXiv:2306.02069, 2023.
[166] Ilias Chalkidis, Nicolas Garneau, C˘at˘alina Goant,˘a, Daniel Katz, and Anders Søgaard. Lex-
files and legallama: Facilitating english multinational legal language model development. In
Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics
(Volume 1: Long Papers), pages 15513–15535, 2023.
[167] Dietrich Trautmann, Alina Petrova, and Frank Schilder. Legal prompt engineering for multi-
lingual legal judgement prediction. arXiv preprint arXiv:2212.02199, 2022.
[168] mteb. Amazon massive intent, . URL https://huggingface.co/datasets/mteb/amazon_massive_
intent.
[169] Phillip Keung, Yichao Lu, György Szarvas, and Noah A. Smith. The multilingual amazon
reviews corpus. In Proceedings of the 2020 Conference on Empirical Methods in Natural
Language Processing, 2020.
[170] Shivalika Singh, Freddie Vargus, Daniel D’souza, Börje Karlsson, Abinaya Mahendiran,
Wei-Yin Ko, Herumb Shandilya, Jay Patel, Deividas Mataciunas, Laura O’Mahony, Mike
Zhang, Ramith Hettiarachchi, Joseph Wilson, Marina Machado, Luisa Moura, Dominik
Krzemi´nski, Hakimeh Fadaei, Irem Ergun, Ifeoma Okoh, Aisha Alaagib, Oshan Mudan-
nayake, Zaid Alyafeai, Vu Chien, Sebastian Ruder, Surya Guthikonda, Emad Alghamdi, Se-
bastian Gehrmann, Niklas Muennighoff, Max Bartolo, Julia Kreutzer, Ahmet Üstün, Marzieh
Fadaee, and Sara Hooker. Aya dataset: An open-access collection for multilingual instruction
tuning. In Lun-Wei Ku, Andre Martins, and Vivek Srikumar, editors, Proceedings of the 62nd
Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers),
pages 11521–11567, Bangkok, Thailand, August 2024. Association for Computational Lin-
guistics. doi: 10.18653/v1/2024.acl-long.620. URL https://aclanthology.org/2024.acl-long.
620.
[171] Haonan Li, Fajri Koto, Minghao Wu, Alham Fikri Aji, and Timothy Baldwin. Bactrian-x:
Multilingual replicable instruction-following models with low-rank adaptation, 2023.
40
[172] eBible.org. ebible. URL https://github.com/BibleNLP.
[173] Alexis Conneau, Kartikay Khandelwal, Naman Goyal, Vishrav Chaudhary, Guillaume Wen-
zek, Francisco Guzmán, Edouard Grave, Myle Ott, Luke Zettlemoyer, and Veselin Stoy-
anov. Unsupervised cross-lingual representation learning at scale. In Dan Jurafsky, Joyce
Chai, Natalie Schluter, and Joel Tetreault, editors, Proceedings of the 58th Annual Meet-
ing of the Association for Computational Linguistics, pages 8440–8451, Online, July 2020.
Association for Computational Linguistics.
doi: 10.18653/v1/2020.acl-main.747.
URL
https://aclanthology.org/2020.acl-main.747.
[174] Guillaume Wenzek, Marie-Anne Lachaux, Alexis Conneau, Vishrav Chaudhary, Francisco
Guzmán, Armand Joulin, and Edouard Grave. CCNet: Extracting high quality monolin-
gual datasets from web crawl data. In Nicoletta Calzolari, Frédéric Béchet, Philippe Blache,
Khalid Choukri, Christopher Cieri, Thierry Declerck, Sara Goggi, Hitoshi Isahara, Bente
Maegaard, Joseph Mariani, Hélène Mazo, Asuncion Moreno, Jan Odijk, and Stelios Piperidis,
editors, Proceedings of the Twelfth Language Resources and Evaluation Conference, pages
4003–4012, Marseille, France, May 2020. European Language Resources Association. URL
https://aclanthology.org/2020.lrec-1.494.
[175] Thuat Nguyen, Chien Van Nguyen, Viet Dac Lai, Hieu Man, Nghia Trung Ngo, Franck Der-
noncourt, Ryan A. Rossi, and Thien Huu Nguyen. Culturax: A cleaned, enormous, and
multilingual dataset for large language models in 167 languages, 2023.
[176] erfanzar. Multi-turn conversational prompts from chatgpt-4. URL https://huggingface.co/
datasets/erfanzar/GPT-4-Prompts.
[177] Tim Dettmers, Artidoro Pagnoni, Ari Holtzman, and Luke Zettlemoyer. Qlora: Efficient
finetuning of quantized llms, 2023.
[178] Ona de Gibert, Graeme Nail, Nikolay Arefyev, Marta Bañón, Jelmer van der Linde, Shaox-
iong Ji, Jaume Zaragoza-Bernabeu, Mikko Aulamo, Gema Ramírez-Sánchez, Andrey Ku-
tuzov, Sampo Pyysalo, Stephan Oepen, and Jörg Tiedemann. A new massive multilingual
dataset for high-performance language technologies, 2024.
[179] Mauro Cettolo, Marcello Federico, Luisa Bentivogli, Jan Niehues, Sebastian Stüker, Kat-
suhito Sudoh, Koichiro Yoshino, and Christian Federmann. Overview of the IWSLT 2017
evaluation campaign. In Proceedings of the 14th International Conference on Spoken Lan-
guage Translation, pages 2–14, Tokyo, Japan, December 14-15 2017. International Workshop
on Spoken Language Translation. URL https://aclanthology.org/2017.iwslt-1.1.
[180] Colin Raffel, Noam Shazeer, Adam Roberts, Katherine Lee, Sharan Narang, Michael Matena,
Yanqi Zhou, Wei Li, and Peter J. Liu. Exploring the limits of transfer learning with a unified
text-to-text transformer. arXiv e-prints, 2019.
[181] Sebastian Ruder, Noah Constant, Jan Botha, Aditya Siddhant, Orhan Firat, Jinlan Fu, Pengfei
Liu, Junjie Hu, Dan Garrette, Graham Neubig, and Melvin Johnson. XTREME-R: Towards
more challenging and nuanced multilingual evaluation. In Proceedings of the 2021 Con-
ference on Empirical Methods in Natural Language Processing, pages 10215–10245, On-
line and Punta Cana, Dominican Republic, November 2021. Association for Computational
Linguistics. doi: 10.18653/v1/2021.emnlp-main.802. URL https://aclanthology.org/2021.
emnlp-main.802.
[182] Daniela Gerz, Pei-Hao Su, Razvan Kusztos, Avishek Mondal, Michal Lis, Eshan Singhal,
Nikola Mrksic, Tsung-Hsien Wen, and Ivan Vulic. Multilingual and cross-lingual intent de-
tection from spoken data. CoRR, abs/2104.08524, 2021. URL https://arxiv.org/abs/2104.
08524.
[183] Xinyu Zhang, Nandan Thakur, Odunayo Ogundepo, Ehsan Kamalloo, David Alfonso-
Hermelo, Xiaoguang Li, Qun Liu, Mehdi Rezagholizadeh, and Jimmy Lin. Making a miracl:
Multilingual information retrieval across a continuum of languages, 2022.
[184] Jianlv Chen, Shitao Xiao, Peitian Zhang, Kun Luo, Defu Lian, and Zheng Liu. Bge m3-
embedding: Multi-lingual, multi-functionality, multi-granularity text embeddings through
self-knowledge distillation, 2024.
41
[185] Pengcheng Qiu, Chaoyi Wu, Xiaoman Zhang, Weixiong Lin, Haicheng Wang, Ya Zhang,
Yanfeng Wang, and Weidi Xie. Towards building multilingual language model for medicine,
2024.
[186] Maxime De Bruyn, Ehsan Lotfi, Jeska Buhmann, and Walter Daelemans. MFAQ: a multi-
lingual FAQ dataset. In Proceedings of the 3rd Workshop on Machine Reading for Question
Answering, pages 1–13, Punta Cana, Dominican Republic, November 2021. Association for
Computational Linguistics. URL https://aclanthology.org/2021.mrqa-1.1.
[187] tyqiangz.
Multilingual
sentiment
datasets.
URL
https://github.com/tyqiangz/
multilingual-sentiment-datasets.
[188] Besnik Fetahu, Zhiyu Chen, Sudipta Kar, Oleg Rokhlenko, and Shervin Malmasi. Multiconer
v2: a large multilingual dataset for fine-grained and noisy named entity recognition. arXiv
preprint arXiv:2310.13213, 2023.
[189] Besnik Fetahu, Sudipta Kar, Zhiyu Chen, Oleg Rokhlenko, and Shervin Malmasi. SemEval-
2023 Task 2: Fine-grained Multilingual Named Entity Recognition (MultiCoNER 2). In
Proceedings of the 17th International Workshop on Semantic Evaluation (SemEval-2023).
Association for Computational Linguistics, 2023.
[190] Nandan Thakur, Luiz Bonifacio, Xinyu Zhang, Odunayo Ogundepo, Ehsan Kamalloo, David
Alfonso-Hermelo, Xiaoguang Li, Qun Liu, Boxing Chen, Mehdi Rezagholizadeh, and Jimmy
Lin. Nomiracl: Knowing when you don’t know for robust multilingual retrieval-augmented
generation. ArXiv, abs/2312.11361, 2023.
[191] Pierre Lison and Jörg Tiedemann. Opensubtitles2016: Extracting large parallel corpora from
movie and tv subtitles, 2016.
[192] Julien Abadji, Pedro Ortiz Suarez, Laurent Romary, and Benoît Sagot. Towards a Cleaner
Document-Oriented Multilingual Crawled Corpus. arXiv e-prints, art. arXiv:2201.06642,
January 2022.
[193] Felipe Soares, Mark Stevenson, Diego Bartolome, and Anna Zaretskaya.
ParaPat: The
multi-million sentences parallel corpus of patents abstracts.
In Proceedings of The 12th
Language Resources and Evaluation Conference, pages 3769–3774, Marseille, France, May
2020. European Language Resources Association. ISBN 979-10-95546-34-4. URL https:
//www.aclweb.org/anthology/2020.lrec-1.465.
[194] Project Gutenberg. Project gutenberg. URL https://www.gutenberg.org/.
[195] RyokoAI. Sharegpt52k. URL https://huggingface.co/datasets/RyokoAI/ShareGPT52K.
[196] Pere-Lluís Huguet Cabot, Simone Tedeschi, Axel-Cyrille Ngonga Ngomo, and Roberto Nav-
igli. Redfm: a filtered and multilingual relation extraction dataset. In Proc. of the 61st Annual
Meeting of the Association for Computational Linguistics: ACL 2023, Toronto, Canada, July
2023. Association for Computational Linguistics. URL https://arxiv.org/abs/2306.09802.
[197] Ye Qi, Devendra Sachan, Matthieu Felix, Sarguna Padmanabhan, and Graham Neubig. When
and why are pre-trained word embeddings useful for neural machine translation? In Proceed-
ings of the 2018 Conference of the North American Chapter of the Association for Compu-
tational Linguistics: Human Language Technologies, Volume 2 (Short Papers), pages 529–
535, New Orleans, Louisiana, June 2018. Association for Computational Linguistics. doi:
10.18653/v1/N18-2084. URL https://aclanthology.org/N18-2084.
[198] Mauro Cettolo, Christian Girardi, and Marcello Federico. WIT3: Web inventory of tran-
scribed and translated talks. In Proceedings of the 16th Annual conference of the European
Association for Machine Translation, pages 261–268, Trento, Italy, May 28–30 2012. Eu-
ropean Association for Machine Translation. URL https://www.aclweb.org/anthology/2012.
eamt-1.60.
[199] FredZhang. toxi-text-3m. URL https://huggingface.co/datasets/FredZhang7/toxi-text-3M.
42
[200] Joakim Nivre, Marie-Catherine de Marneffe, Filip Ginter, Jan Hajiˇc, Christopher D. Man-
ning, Sampo Pyysalo, Sebastian Schuster, Francis Tyers, and Daniel Zeman. Universal De-
pendencies v2: An evergrowing multilingual treebank collection.
In Nicoletta Calzolari,
Frédéric Béchet, Philippe Blache, Khalid Choukri, Christopher Cieri, Thierry Declerck, Sara
Goggi, Hitoshi Isahara, Bente Maegaard, Joseph Mariani, Hélène Mazo, Asuncion Moreno,
Jan Odijk, and Stelios Piperidis, editors, Proceedings of the Twelfth Language Resources and
Evaluation Conference, pages 4034–4043, Marseille, France, May 2020. European Language
Resources Association. ISBN 979-10-95546-34-4. URL https://aclanthology.org/2020.lrec-1.
497.
[201] Xiaoman Pan, Boliang Zhang, Jonathan May, Joel Nothman, Kevin Knight, and Heng Ji.
Cross-lingual name tagging and linking for 282 languages. In Proceedings of the 55th Annual
Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pages
1946–1958, Vancouver, Canada, July 2017. Association for Computational Linguistics. doi:
10.18653/v1/P17-1178. URL https://www.aclweb.org/anthology/P17-1178.
[202] Afshin Rahimi, Yuan Li, and Trevor Cohn. Massively multilingual transfer for NER. In
Proceedings of the 57th Annual Meeting of the Association for Computational Linguistics,
pages 151–164, Florence, Italy, July 2019. Association for Computational Linguistics. URL
https://www.aclweb.org/anthology/P19-1015.
[203] Wikimedia Foundation. Wikimedia downloads. URL https://dumps.wikimedia.org.
[204] Krishna Srinivasan, Karthik Raman, Jiecao Chen, Michael Bendersky, and Marc Najork. Wit:
Wikipedia-based image text dataset for multimodal multilingual machine learning. arXiv
preprint arXiv:2103.01913, 2021.
[205] Niklas Muennighoff, Thomas Wang, Lintang Sutawika, Adam Roberts, Stella Biderman,
Teven Le Scao, M Saiful Bari, Sheng Shen, Zheng-Xin Yong, Hailey Schoelkopf, et al.
Crosslingual generalization through multitask finetuning. arXiv preprint arXiv:2211.01786,
2022.
[206] Shamsuddeen Hassan Muhammad, Idris Abdulmumin, Abinew Ali Ayele, Nedjma Ousid-
houm, David Ifeoluwa Adelani, Seid Muhie Yimam, Ibrahim Sa’id Ahmad, Meriem Beloucif,
Saif M. Mohammad, Sebastian Ruder, Oumaima Hourrane, Pavel Brazdil, Felermino Dário
Mário António Ali, Davis David, Salomey Osei, Bello Shehu Bello, Falalu Ibrahim, Tajud-
deen Gwadabe, Samuel Rutunda, Tadesse Belay, Wendimu Baye Messelle, Hailu Beshada
Balcha, Sisay Adugna Chala, Hagos Tesfahun Gebremichael, Bernard Opoku, and Steven
Arthur. Afrisenti: A twitter sentiment analysis benchmark for african languages, 2023.
[207] Evgeniia Razumovskaia, Joshua Maynez, Annie Louis, Mirella Lapata, and Shashi Narayan.
Little red riding hood goes around the globe:crosslingual story planning and generation with
large language models, 2024.
[208] Lucas Bandarkar, Davis Liang, Benjamin Muller, Mikel Artetxe, Satya Narayan Shukla,
Donald Husa, Naman Goyal, Abhinandan Krishnan, Luke Zettlemoyer, and Madian Khabsa.
The belebele benchmark: a parallel reading comprehension dataset in 122 language variants.
arXiv preprint arXiv:2308.16884, 2023.
[209] BioMistral. Bioinstructqa. URL https://huggingface.co/datasets/BioMistral/BioInstructQA.
[210] mteb. Mteb benchmark, . URL https://huggingface.co/datasets/mteb/bucc-bitext-mining.
[211] Abhik Bhattacharjee, Tahmid Hasan, Wasi Uddin Ahmad, Yuan-Fang Li, Yong-Bin Kang,
and Rifat Shahriyar.
Crosssum: Beyond english-centric cross-lingual summarization for
1,500+ language pairs, 2023.
[212] Ashish V. Thapliyal, Jordi Pont-Tuset, Xi Chen, and Radu Soricut. Crossmodal-3600: A
massively multilingual multimodal evaluation dataset, 2022.
[213] Momchil Hardalov, Todor Mihaylov, Dimitrina Zlatkova, Yoan Dinkov, Ivan Koychev, and
Preslav Nakov. Exams: A multi-subject high school examinations dataset for cross-lingual
and multilingual question answering, 2020.
43
[214] Ilias Chalkidis, Tommaso Pasini, Sheng Zhang, Letizia Tomada, Sebastian Schwemer, and
Anders Søgaard.
Fairlex: A multilingual benchmark for evaluating fairness in legal text
processing. In Proceedings of the 60th Annual Meeting of the Association for Computational
Linguistics (Volume 1: Long Papers), pages 4389–4406, 2022.
[215] NLLB Team. No language left behind: Scaling human-centered machine translation. arXiv
preprint arXiv:2207.04672, 2022.
[216] Naman Goyal, Cynthia Gao, Vishrav Chaudhary, Peng-Jen Chen, Guillaume Wenzek, Da Ju,
Sanjana Krishnan, Marc’Aurelio Ranzato, Francisco Guzmán, and Angela Fan. The flores-
101 evaluation benchmark for low-resource and multilingual machine translation. Transac-
tions of the Association for Computational Linguistics, 10:522–538, 2022.
[217] Francisco Guzmán, Peng-Jen Chen, Myle Ott, Juan Pino, Guillaume Lample, Philipp
Koehn, Vishrav Chaudhary, and Marc’Aurelio Ranzato.
Two new evaluation datasets
for low-resource machine translation: Nepali-english and sinhala-english.
arXiv preprint
arXiv:1902.01382, 2019.
[218] Da Yin, Hritik Bansal, Masoud Monajatipoor, Liunian Harold Li, and Kai-Wei Chang. Ge-
omlama: Geo-diverse commonsense probing on multilingual pre-trained language models,
2022.
[219] Qiwei Peng, Yekun Chai, and Xuhong Li.
Humaneval-xl:
A multilingual code gen-
eration benchmark for cross-lingual natural language generalization.
arXiv preprint
arXiv:2402.16694, 2024.
[220] Viet Dac Lai, Chien Van Nguyen, Nghia Trung Ngo, Thuat Nguyen, Franck Dernoncourt,
Ryan A Rossi, and Thien Huu Nguyen. Okapi: Instruction-tuned large language models in
multiple languages with reinforcement learning from human feedback. arXiv e-prints, pages
arXiv–2307, 2023.
[221] Wenxuan Zhang, Sharifah Mahani Aljunied, Chang Gao, Yew Ken Chia, and Lidong Bing.
M3exam: A multilingual, multimodal, multilevel benchmark for examining large language
models, 2023.
[222] Yash Verma, Anubhav Jangra, Raghvendra Verma, and Sriparna Saha. Large scale multi-
lingual multi-modal summarization dataset. In Andreas Vlachos and Isabelle Augenstein,
editors, Proceedings of the 17th Conference of the European Chapter of the Association
for Computational Linguistics, pages 3620–3632, Dubrovnik, Croatia, May 2023. Associ-
ation for Computational Linguistics.
doi: 10.18653/v1/2023.eacl-main.263.
URL https:
//aclanthology.org/2023.eacl-main.263.
[223] Phillip Keung, Yichao Lu, György Szarvas, and Noah A. Smith. The multilingual amazon
reviews corpus, 2020.
[224] David Ifeoluwa Adelani, Jade Abbott, Graham Neubig, Daniel D’souza, Julia Kreutzer,
Constantine Lignos, Chester Palen-Michel, Happy Buzaaba, Shruti Rijhwani, Sebastian
Ruder, Stephen Mayhew, Israel Abebe Azime, Shamsuddeen Muhammad, Chris Chinenye
Emezue, Joyce Nakatumba-Nabende, Perez Ogayo, Anuoluwapo Aremu, Catherine Gitau,
Derguene Mbaye, Jesujoba Alabi, Seid Muhie Yimam, Tajuddeen Gwadabe, Ignatius Ezeani,
Rubungo Andre Niyongabo, Jonathan Mukiibi, Verrah Otiende, Iroro Orife, Davis David,
Samba Ngom, Tosin Adewumi, Paul Rayson, Mofetoluwa Adeyemi, Gerald Muriuki, Em-
manuel Anebi, Chiamaka Chukwuneke, Nkiruka Odu, Eric Peter Wairagala, Samuel Oy-
erinde, Clemencia Siro, Tobius Saul Bateesa, Temilola Oloyede, Yvonne Wambui, Vic-
tor Akinode, Deborah Nabagereka, Maurice Katusiime, Ayodele Awokoya, Mouhamadane
MBOUP, Dibora Gebreyohannes, Henok Tilaye, Kelechi Nwaike, Degaga Wolde, Abdoulaye
Faye, Blessing Sibanda, Orevaoghene Ahia, Bonaventure F. P. Dossou, Kelechi Ogueji,
Thierno Ibrahima DIOP, Abdoulaye Diallo, Adewale Akinfaderin, Tendai Marengereke, and
Salomey Osei. Masakhaner: Named entity recognition for african languages, 2021.
[225] David Ifeoluwa Adelani, Marek Masiak, Israel Abebe Azime, Jesujoba Alabi, Atnafu Lam-
bebo Tonja, Christine Mwase, Odunayo Ogundepo, Bonaventure F. P. Dossou, Akintunde
44
Oladipo, Doreen Nixdorf, Chris Chinenye Emezue, sana al azzawi, Blessing Sibanda, Davis
David, Lolwethu Ndolela, Jonathan Mukiibi, Tunde Ajayi, Tatiana Moteu, Brian Odhi-
ambo, Abraham Owodunni, Nnaemeka Obiefuna, Muhidin Mohamed, Shamsuddeen Has-
san Muhammad, Teshome Mulugeta Ababu, Saheed Abdullahi Salahudeen, Mesay Gemeda
Yigezu, Tajuddeen Gwadabe, Idris Abdulmumin, Mahlet Taye, Oluwabusayo Awoyomi,
Iyanuoluwa Shode, Tolulope Adelani, Habiba Abdulganiyu, Abdul-Hakeem Omotayo,
Adetola Adeeko, Abeeb Afolabi, Anuoluwapo Aremu, Olanrewaju Samuel, Clemencia Siro,
Wangari Kimotho, Onyekachi Ogbu, Chinedu Mbonu, Chiamaka Chukwuneke, Samuel
Fanijo, Jessica Ojo, Oyinkansola Awosan, Tadesse Kebede, Toadoum Sari Sakayo, Pamela
Nyatsine, Freedmore Sidume, Oreen Yousuf, Mardiyyah Oduwole, Tshinu Tshinu, Ussen Ki-
manuka, Thina Diko, Siyanda Nxakama, Sinodos Nigusse, Abdulmejid Johar, Shafie Mo-
hamed, Fuad Mire Hassan, Moges Ahmed Mehamed, Evrard Ngabire, Jules Jules, Ivan
Ssenkungu, and Pontus Stenetorp. Masakhanews: News topic classification for african lan-
guages, 2023.
[226] Jack FitzGerald, Christopher Hench, Charith Peris, Scott Mackie, Kay Rottmann, Ana
Sanchez, Aaron Nash, Liam Urbach, Vishesh Kakarala, Richa Singh, Swetha Ranganath,
Laurie Crist, Misha Britan, Wouter Leeuwis, Gokhan Tur, and Prem Natarajan. Massive:
A 1m-example multilingual natural language understanding dataset with 51 typologically-
diverse languages, 2022.
[227] Soravit Changpinyo, Linting Xue, Michal Yarom, Ashish V. Thapliyal, Idan Szpektor, Julien
Amelot, Xi Chen, and Radu Soricut. Maxm: Towards multilingual visual question answering,
2023.
[228] Kabir Ahuja, Harshita Diddee, Rishav Hada, Millicent Ochieng, Krithika Ramesh, Prachi
Jain, Akshay Nambi, Tanuja Ganu, Sameer Segal, Maxamed Axmed, Kalika Bali, and
Sunayana Sitaram. Mega: Multilingual evaluation of generative ai, 2023.
[229] Sanchit Ahuja, Divyanshu Aggarwal, Varun Gumma, Ishaan Watts, Ashutosh Sathe, Millicent
Ochieng, Rishav Hada, Prachi Jain, Maxamed Axmed, Kalika Bali, and Sunayana Sitaram.
Megaverse: Benchmarking large language models across languages, modalities, models and
tasks, 2024.
[230] Ziyin Zhang, Yikang Liu, Weifang Huang, Junyu Mao, Rui Wang, and Hai Hu. Mela: Multi-
lingual evaluation of linguistic acceptability, 2024.
[231] Patrick Lewis, Barlas O˘guz, Ruty Rinott, Sebastian Riedel, and Holger Schwenk. Mlqa:
Evaluating cross-lingual extractive question answering, 2020.
[232] Pengcheng Qiu, Chaoyi Wu, Xiaoman Zhang, Weixiong Lin, Haicheng Wang, Ya Zhang,
Yanfeng Wang, and Weidi Xie. Towards building multilingual language model for medicine,
2024.
[233] Shervin Malmasi, Anjie Fang, Besnik Fetahu, Sudipta Kar, and Oleg Rokhlenko. Multiconer:
A large-scale multilingual dataset for complex named entity recognition, 2022.
[234] Ilias Chalkidis, Manos Fergadiotis, and Ion Androutsopoulos.
MultiEURLEX - a multi-
lingual and multi-label legal document classification dataset for zero-shot cross-lingual trans-
fer. In Marie-Francine Moens, Xuanjing Huang, Lucia Specia, and Scott Wen-tau Yih, edi-
tors, Proceedings of the 2021 Conference on Empirical Methods in Natural Language Pro-
cessing, pages 6974–6996, Online and Punta Cana, Dominican Republic, November 2021.
Association for Computational Linguistics. doi: 10.18653/v1/2021.emnlp-main.559. URL
https://aclanthology.org/2021.emnlp-main.559.
[235] Anubha Kabra, Emmy Liu, Simran Khanuja, Alham Fikri Aji, Genta Winata, Samuel
Cahyawijaya, Anuoluwapo Aremu, Perez Ogayo, and Graham Neubig. Multi-lingual and
multi-cultural figurative language understanding.
In Anna Rogers, Jordan Boyd-Graber,
and Naoaki Okazaki, editors, Findings of the Association for Computational Linguistics:
ACL 2023, pages 8269–8284, Toronto, Canada, July 2023. Association for Computational
Linguistics. doi: 10.18653/v1/2023.findings-acl.525. URL https://aclanthology.org/2023.
findings-acl.525.
45
[236] Genta Indra Winata, Alham Fikri Aji, Samuel Cahyawijaya, Rahmad Mahendra, Fajri Koto,
Ade Romadhony, Kemal Kurniawan, David Moeljadi, Radityo Eko Prasojo, Pascale Fung,
Timothy Baldwin, Jey Han Lau, Rico Sennrich, and Sebastian Ruder. Nusax: Multilingual
parallel sentiment dataset for 10 indonesian local languages, 2023.
[237] Zhiruo Wang, Shuyan Zhou, Daniel Fried, and Graham Neubig. Execution-based evaluation
for open-domain code generation, 2023.
[238] Biao Zhang, Philip Williams, Ivan Titov, and Rico Sennrich. Improving massively multilin-
gual neural machine translation and zero-shot translation. In Proceedings of the 58th Annual
Meeting of the Association for Computational Linguistics, pages 1628–1639, 2020.
[239] Yinfei Yang, Yuan Zhang, Chris Tar, and Jason Baldridge. PAWS-X: A cross-lingual ad-
versarial dataset for paraphrase identification.
In Kentaro Inui, Jing Jiang, Vincent Ng,
and Xiaojun Wan, editors, Proceedings of the 2019 Conference on Empirical Methods
in Natural Language Processing and the 9th International Joint Conference on Natural
Language Processing (EMNLP-IJCNLP), pages 3687–3692, Hong Kong, China, Novem-
ber 2019. Association for Computational Linguistics. doi: 10.18653/v1/D19-1382. URL
https://aclanthology.org/D19-1382.
[240] Ashok Urlana, Pinzhen Chen, Zheng Zhao, Shay B. Cohen, Manish Shrivastava, and Barry
Haddow. Pmindiasum: Multilingual and cross-lingual headline summarization for languages
in india, 2023.
[241] Rahul Goel, Waleed Ammar, Aditya Gupta, Siddharth Vashishtha, Motoki Sano, Faiz Surani,
Max Chang, HyunJeong Choe, David Greene, Kyle He, Rattima Nitisaroj, Anna Trukhina,
Shachi Paul, Pararth Shah, Rushin Shah, and Zhou Yu. Presto: A multilingual dataset for
parsing realistic task-oriented dialogs, 2023.
[242] Elizabeth Clark, Shruti Rijhwani, Sebastian Gehrmann, Joshua Maynez, Roee Aharoni, Vitaly
Nikolaev, Thibault Sellam, Aditya Siddhant, Dipanjan Das, and Ankur P. Parikh. Seahorse:
A multilingual, multifaceted dataset for summarization evaluation, 2023.
[243] David Ifeoluwa Adelani, Hannah Liu, Xiaoyu Shen, Nikita Vassilyev, Jesujoba O. Alabi,
Yanke Mao, Haonan Gao, and Annie En-Shiun Lee. Sib-200: A simple, inclusive, and big
evaluation dataset for topic classification in 200+ languages and dialects, 2023.
[244] Alessandro Seganti, Klaudia Firl ˛ag, Helena Skowronska, Michał Satława, and Piotr An-
druszkiewicz.
Multilingual entity and relation extraction dataset and model.
In Paola
Merlo, Jorg Tiedemann, and Reut Tsarfaty, editors, Proceedings of the 16th Conference
of the European Chapter of the Association for Computational Linguistics: Main Volume,
pages 1946–1955, Online, April 2021. Association for Computational Linguistics.
doi:
10.18653/v1/2021.eacl-main.166. URL https://aclanthology.org/2021.eacl-main.166.
[245] Philip May. Machine translated multilingual sts benchmark dataset., 2021. URL https://
github.com/PhilipMay/stsb-multi-mt.
[246] Jörg Tiedemann. The tatoeba translation challenge – realistic data sets for low resource and
multilingual MT. In Proceedings of the Fifth Conference on Machine Translation, pages
1174–1182, Online, November 2020. Association for Computational Linguistics. URL https:
//aclanthology.org/2020.wmt-1.139.
[247] Anirudh Srinivasan and Eunsol Choi. TyDiP: A dataset for politeness classification in nine
typologically diverse languages. In Yoav Goldberg, Zornitsa Kozareva, and Yue Zhang, edi-
tors, Findings of the Association for Computational Linguistics: EMNLP 2022, pages 5723–
5738, Abu Dhabi, United Arab Emirates, December 2022. Association for Computational
Linguistics. doi: 10.18653/v1/2022.findings-emnlp.420. URL https://aclanthology.org/2022.
findings-emnlp.420.
[248] Jonathan H Clark, Eunsol Choi, Michael Collins, Dan Garrette, Tom Kwiatkowski, Vitaly
Nikolaev, and Jennimaria Palomaki. Tydi qa: A benchmark for information-seeking question
answering in ty pologically di verse languages. Transactions of the Association for Compu-
tational Linguistics, 8:454–470, 2020.
46
[249] Shubham Mittal, Megha Sundriyal, and Preslav Nakov. Lost in translation, found in spans:
Identifying claims in multilingual social media. In Houda Bouamor, Juan Pino, and Kalika
Bali, editors, Proceedings of the 2023 Conference on Empirical Methods in Natural Language
Processing, pages 3887–3902, Singapore, December 2023. Association for Computational
Linguistics. doi: 10.18653/v1/2023.emnlp-main.236. URL https://aclanthology.org/2023.
emnlp-main.236.
[250] Mehrad Moradshahi, Tianhao Shen, Kalika Bali, Monojit Choudhury, Gaël de Chalendar, An-
mol Goel, Sungkyun Kim, Prashant Kodali, Ponnurangam Kumaraguru, Nasredine Semmar,
Sina J. Semnani, Jiwon Seo, Vivek Seshadri, Manish Shrivastava, Michael Sun, Aditya Ya-
davalli, Chaobin You, Deyi Xiong, and Monica S. Lam. X-risawoz: High-quality end-to-end
multilingual dialogue datasets and few-shot agents, 2023.
[251] Edoardo Maria Ponti, Goran Glavaš, Olga Majewska, Qianchu Liu, Ivan Vuli´c, and Anna
Korhonen. XCOPA: A multilingual dataset for causal commonsense reasoning. In Bonnie
Webber, Trevor Cohn, Yulan He, and Yang Liu, editors, Proceedings of the 2020 Confer-
ence on Empirical Methods in Natural Language Processing (EMNLP), pages 2362–2376,
Online, November 2020. Association for Computational Linguistics. doi: 10.18653/v1/2020.
emnlp-main.185. URL https://aclanthology.org/2020.emnlp-main.185.
[252] Bill Yuchen Lin, Seyeon Lee, Xiaoyang Qiao, and Xiang Ren. Common sense beyond en-
glish: Evaluating and improving multilingual language models for commonsense reasoning.
In Proceedings of the 59th Annual Meeting of the Association for Computational Linguis-
tics and the 11th International Joint Conference on Natural Language Processing (Volume 1:
Long Papers), pages 1274–1287, 2021.
[253] Chen Zhang, Luis D’Haro, Chengguang Tang, Ke Shi, Guohua Tang, and Haizhou Li. xDial-
eval: A multilingual open-domain dialogue evaluation benchmark. In Houda Bouamor, Juan
Pino, and Kalika Bali, editors, Findings of the Association for Computational Linguistics:
EMNLP 2023, pages 5579–5601, Singapore, December 2023. Association for Computational
Linguistics. doi: 10.18653/v1/2023.findings-emnlp.371. URL https://aclanthology.org/2023.
findings-emnlp.371.
[254] Yaobo Liang, Nan Duan, Yeyun Gong, Ning Wu, Fenfei Guo, Weizhen Qi, Ming Gong, Lin-
jun Shou, Daxin Jiang, Guihong Cao, Xiaodong Fan, Ruofei Zhang, Rahul Agrawal, Edward
Cui, Sining Wei, Taroon Bharti, Ying Qiao, Jiun-Hung Chen, Winnie Wu, Shuguang Liu, Fan
Yang, Daniel Campos, Rangan Majumder, and Ming Zhou. Xglue: A new benchmark dataset
for cross-lingual pre-training, understanding and generation, 2020.
[255] Tahmid Hasan, Abhik Bhattacharjee, Md Saiful Islam, Kazi Samin, Yuan-Fang Li, Yong-Bin
Kang, M. Sohel Rahman, and Rifat Shahriyar. Xl-sum: Large-scale multilingual abstractive
summarization for 44 languages, 2021.
[256] Alexis Conneau, Ruty Rinott, Guillaume Lample, Adina Williams, Samuel Bowman, Holger
Schwenk, and Veselin Stoyanov. Xnli: Evaluating cross-lingual sentence representations. In
Proceedings of the 2018 Conference on Empirical Methods in Natural Language Processing,
pages 2475–2485, 2018.
[257] Mikel Artetxe, Sebastian Ruder, and Dani Yogatama. On the cross-lingual transferability of
monolingual representations. In Proceedings of the 58th Annual Meeting of the Association
for Computational Linguistics, pages 4623–4637, 2020.
[258] Yusen Zhang, Jun Wang, Zhiguo Wang, and Rui Zhang. Xsemplr: Cross-lingual semantic
parsing in multiple natural languages and meaning representations, 2023.
[259] Junjie Hu, Sebastian Ruder, Aditya Siddhant, Graham Neubig, Orhan Firat, and Melvin John-
son. Xtreme: A massively multilingual multi-task benchmark for evaluating cross-lingual
generalization, 2020.
[260] Sebastian Ruder, Noah Constant, Jan Botha, Aditya Siddhant, Orhan Firat, Jinlan Fu, Pengfei
Liu, Junjie Hu, Dan Garrette, Graham Neubig, and Melvin Johnson. XTREME-R: Towards
more challenging and nuanced multilingual evaluation. In Marie-Francine Moens, Xuanjing
47
Huang, Lucia Specia, and Scott Wen-tau Yih, editors, Proceedings of the 2021 Conference on
Empirical Methods in Natural Language Processing, pages 10215–10245, Online and Punta
Cana, Dominican Republic, November 2021. Association for Computational Linguistics. doi:
10.18653/v1/2021.emnlp-main.802. URL https://aclanthology.org/2021.emnlp-main.802.
[261] Alexey Tikhonov and Max Ryabinin.
It’s All in the Heads: Using Attention Heads as
a Baseline for Cross-Lingual Transfer in Commonsense Reasoning. In Chengqing Zong,
Fei Xia, Wenjie Li, and Roberto Navigli, editors, Findings of the Association for Com-
putational Linguistics: ACL-IJCNLP 2021, pages 3534–3546, Online, August 2021. As-
sociation for Computational Linguistics.
doi: 10.18653/v1/2021.findings-acl.310.
URL
https://aclanthology.org/2021.findings-acl.310.
[262] Bill Yuchen Lin, Seyeon Lee, Xiaoyang Qiao, and Xiang Ren. Common sense beyond En-
glish: Evaluating and improving multilingual language models for commonsense reasoning.
In Proceedings of the 59th Annual Meeting of the Association for Computational Linguis-
tics and the 11th International Joint Conference on Natural Language Processing (Volume 1:
Long Papers), pages 1274–1287, Online, August 2021. Association for Computational Lin-
guistics. doi: 10.18653/v1/2021.acl-long.102. URL https://aclanthology.org/2021.acl-long.
102.
[263] Kaiyu Huang, Peng Li, Junpeng Liu, Maosong Sun, and Yang Liu. Learn and consolidate:
Continual adaptation for zero-shot and multilingual neural machine translation. In Proceed-
ings of the 2023 Conference on Empirical Methods in Natural Language Processing, pages
13938–13951, 2023.
[264] Melvin Johnson, Mike Schuster, Quoc V Le, Maxim Krikun, Yonghui Wu, Zhifeng Chen,
Nikhil Thorat, Fernanda Viégas, Martin Wattenberg, Greg Corrado, et al. Google’s multilin-
gual neural machine translation system: Enabling zero-shot translation. Transactions of the
Association for Computational Linguistics, 5:339–351, 2017.
[265] Kaiyu Huang, Peng Li, Jin Ma, Ting Yao, and Yang Liu. Knowledge transfer in incremen-
tal learning for multilingual neural machine translation. In Proceedings of the 61st Annual
Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pages
15286–15304, 2023.
[266] Zehui Lin, Liwei Wu, Mingxuan Wang, and Lei Li. Learning language specific sub-network
for multilingual machine translation. In Proceedings of the 59th Annual Meeting of the Asso-
ciation for Computational Linguistics and the 11th International Joint Conference on Natural
Language Processing (Volume 1: Long Papers), pages 293–305, 2021.
[267] Carlos Escolano, Marta R Costa-Jussà, and José AR Fonollosa. From bilingual to multilingual
neural-based machine translation by incremental training.
Journal of the Association for
Information Science and Technology, 72(2):190–203, 2021.
[268] Bonan Min, Hayley Ross, Elior Sulem, Amir Pouran Ben Veyseh, Thien Huu Nguyen, Oscar
Sainz, Eneko Agirre, Ilana Heintz, and Dan Roth. Recent advances in natural language pro-
cessing via large pre-trained language models: A survey. ACM Computing Surveys, 56(2):
1–40, 2023.
[269] Bohan Li, Hao Zhou, Junxian He, Mingxuan Wang, Yiming Yang, and Lei Li. On the sentence
embeddings from pre-trained language models. In Proceedings of the 2020 Conference on
Empirical Methods in Natural Language Processing (EMNLP), pages 9119–9130, 2020.
[270] Linmei Hu, Zeyi Liu, Ziwang Zhao, Lei Hou, Liqiang Nie, and Juanzi Li.
A survey of
knowledge enhanced pre-trained language models. IEEE Transactions on Knowledge and
Data Engineering, 2023.
[271] Jacob Devlin, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova.
Bert:
Pre-
training of deep bidirectional transformers for language understanding.
arXiv preprint
arXiv:1810.04805, 2018.
[272] Alec Radford, Karthik Narasimhan, Tim Salimans, Ilya Sutskever, et al. Improving language
understanding by generative pre-training, 2018.
48
[273] Mike Lewis, Yinhan Liu, Naman Goyal, Marjan Ghazvininejad, Abdelrahman Mohamed,
Omer Levy, Veselin Stoyanov, and Luke Zettlemoyer. Bart: Denoising sequence-to-sequence
pre-training for natural language generation, translation, and comprehension. In Proceedings
of the 58th Annual Meeting of the Association for Computational Linguistics, pages 7871–
7880, 2020.
[274] Junyi Li, Tianyi Tang, Wayne Xin Zhao, Jian-Yun Nie, and Ji-Rong Wen. Pretrained language
models for text generation: A survey. arXiv preprint arXiv:2201.05273, 2022.
[275] Alec Radford, Jeffrey Wu, Rewon Child, David Luan, Dario Amodei, Ilya Sutskever, et al.
Language models are unsupervised multitask learners. OpenAI blog, 1(8):9, 2019.
[276] Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B Brown, Benjamin Chess, Rewon
Child, Scott Gray, Alec Radford, Jeffrey Wu, and Dario Amodei. Scaling laws for neural
language models. arXiv preprint arXiv:2001.08361, 2020.
[277] William Fedus, Barret Zoph, and Noam Shazeer. Switch transformers: Scaling to trillion
parameter models with simple and efficient sparsity. Journal of Machine Learning Research,
23(120):1–39, 2022.
[278] Alexis Conneau and Guillaume Lample. Cross-lingual language model pretraining. Advances
in neural information processing systems, 32, 2019.
[279] Roee Aharoni, Melvin Johnson, and Orhan Firat. Massively multilingual neural machine
translation. In Proceedings of the 2019 Conference of the North American Chapter of the
Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long
and Short Papers), pages 3874–3884, 2019.
[280] Orhan Firat, Kyunghyun Cho, Baskaran Sankaran, Fatos T Yarman Vural, and Yoshua Ben-
gio. Multi-way, multilingual neural machine translation. Computer Speech and Language,
45(C):236–252, 2017.
[281] Ekaterina Loginova, Stalin Varanasi, and Günter Neumann.
Towards multilingual neu-
ral question answering.
In New Trends in Databases and Information Systems: ADBIS
2018 Short Papers and Workshops, AI* QA, BIGPMED, CSACDB, M2U, BigDataMAPS,
ISTREND, DC, Budapest, Hungary, September, 2-5, 2018, Proceedings 22, pages 274–285.
Springer, 2018.
[282] Ekaterina Loginova, Stalin Varanasi, and Günter Neumann. Towards end-to-end multilingual
question answering. Information Systems Frontiers, 23(1):227–241, 2021.
[283] Sebastian Ruder and Avirup Sil. Multi-domain multilingual question answering. In Proceed-
ings of the 2021 Conference on Empirical Methods in Natural Language Processing: Tutorial
Abstracts, pages 17–21, 2021.
[284] Yuwei Fang, Shuohang Wang, Yichong Xu, Ruochen Xu, Siqi Sun, Chenguang Zhu, and
Michael Zeng. Leveraging knowledge in multilingual commonsense reasoning. In Findings
of the Association for Computational Linguistics: ACL 2022, pages 3237–3246, 2022.
[285] Yejin Bang, Samuel Cahyawijaya, Nayeon Lee, Wenliang Dai, Dan Su, Bryan Wilie, Holy
Lovenia, Ziwei Ji, Tiezheng Yu, Willy Chung, et al. A multitask, multilingual, multimodal
evaluation of chatgpt on reasoning, hallucination, and interactivity. In Proceedings of the 13th
International Joint Conference on Natural Language Processing and the 3rd Conference of
the Asia-Pacific Chapter of the Association for Computational Linguistics (Volume 1: Long
Papers), pages 675–718, 2023.
[286] Zhengyuan Yang, Linjie Li, Kevin Lin, Jianfeng Wang, Chung-Ching Lin, Zicheng Liu, and
Lijuan Wang. The dawn of lmms: Preliminary explorations with gpt-4v (ision). arXiv preprint
arXiv:2309.17421, 9(1):1, 2023.
[287] Niklas Muennighoff, Alexander Rush, Boaz Barak, Teven Le Scao, Nouamane Tazi, Alek-
sandra Piktus, Sampo Pyysalo, Thomas Wolf, and Colin A Raffel. Scaling data-constrained
language models. Advances in Neural Information Processing Systems, 36, 2024.
49
[288] Armen Aghajanyan, Lili Yu, Alexis Conneau, Wei-Ning Hsu, Karen Hambardzumyan, Susan
Zhang, Stephen Roller, Naman Goyal, Omer Levy, and Luke Zettlemoyer. Scaling laws for
generative mixed-modal language models. In International Conference on Machine Learning,
pages 265–279. PMLR, 2023.
[289] Wayne Xin Zhao, Kun Zhou, Junyi Li, Tianyi Tang, Xiaolei Wang, Yupeng Hou, Yingqian
Min, Beichen Zhang, Junjie Zhang, Zican Dong, et al. A survey of large language models.
arXiv preprint arXiv:2303.18223, 2023.
[290] Xuan Ouyang, Shuohuan Wang, Chao Pang, Yu Sun, Hao Tian, Hua Wu, and Haifeng
Wang. Ernie-m: Enhanced multilingual representation by aligning cross-lingual semantics
with monolingual corpora. arXiv preprint arXiv:2012.15674, 2020.
[291] David Uthus, Santiago Ontañón, Joshua Ainslie, and Mandy Guo. mlongt5: A multilingual
and efficient text-to-text transformer for longer sequences. arXiv preprint arXiv:2305.11129,
2023.
[292] Alexis Conneau, Kartikay Khandelwal, Naman Goyal, Vishrav Chaudhary, Guillaume
Wenzek, Francisco Guzmán, Edouard Grave, Myle Ott, Luke Zettlemoyer, and Veselin
Stoyanov.
Unsupervised cross-lingual representation learning at scale.
arXiv preprint
arXiv:1911.02116, 2019.
[293] Davis Liang, Hila Gonen, Yuning Mao, Rui Hou, Naman Goyal, Marjan Ghazvininejad, Luke
Zettlemoyer, and Madian Khabsa. Xlm-v: Overcoming the vocabulary bottleneck in multi-
lingual masked language models. arXiv preprint arXiv:2301.10472, 2023.
[294] Hyung Won Chung, Noah Constant, Xavier Garcia, Adam Roberts, Yi Tay, Sharan Narang,
and Orhan Firat. Unimax: Fairer and more effective language sampling for large-scale mul-
tilingual pretraining. arXiv preprint arXiv:2304.09151, 2023.
[295] Raj Dabre, Chenhui Chu, and Anoop Kunchukuttan. A survey of multilingual neural machine
translation. ACM Computing Surveys (CSUR), 53(5):1–38, 2020.
[296] Xavier Garcia, Noah Constant, Ankur Parikh, and Orhan Firat. Towards continual learning
for multilingual machine translation via vocabulary substitution. In Proceedings of the 2021
Conference of the North American Chapter of the Association for Computational Linguistics:
Human Language Technologies, pages 1184–1192, 2021.
[297] Kaiyu Huang, Peng Li, Jin Ma, and Yang Liu. Entropy-based vocabulary substitution for
incremental learning in multilingual neural machine translation. In Proceedings of the 2022
Conference on Empirical Methods in Natural Language Processing, pages 10537–10550,
2022.
[298] Shiyue Zhang, Vishrav Chaudhary, Naman Goyal, James Cross, Guillaume Wenzek, Mohit
Bansal, and Francisco Guzman. How robust is neural machine translation to language imbal-
ance in multilingual tokenizer training? arXiv preprint arXiv:2204.14268, 2022.
[299] Yiming Cui, Ziqing Yang, and Xin Yao. Efficient and effective text encoding for chinese
llama and alpaca. arXiv preprint arXiv:2304.08177, 2023.
[300] HIT-SCIR. Chinese-mixtral-8x7b: An open-source mixture-of-experts llm. https://github.
com/HIT-SCIR/Chinese-Mixtral-8x7B, 2024.
[301] Zhengyan Zhang, Yuxian Gu, Xu Han, Shengqi Chen, Chaojun Xiao, Zhenbo Sun, Yuan Yao,
Fanchao Qi, Jian Guan, Pei Ke, et al. Cpm-2: Large-scale cost-effective pre-trained language
models. AI Open, 2:216–224, 2021.
[302] Pierpaolo Basile, Elio Musacchio, Marco Polignano, Lucia Siciliani, Giuseppe Fiameni, and
Giovanni Semeraro.
Llamantino: Llama 2 models for effective text generation in italian
language. arXiv preprint arXiv:2312.09993, 2023.
[303] Risto Luukkonen, Ville Komulainen, Jouni Luoma, Anni Eskelinen, Jenna Kanerva, Hanna-
Mari Kristiina Kupari, Filip Ginter, Veronika Laippala, Niklas Muennighoff, Aleksandra Pik-
tus, et al. Fingpt: Large generative models for a small language. In The 2023 Conference on
Empirical Methods in Natural Language Processing, 2023.
50
[304] Ramon Pires, Hugo Abonizio, Thales Sales Almeida, and Rodrigo Nogueira. Sabiá: Por-
tuguese large language models. In Brazilian Conference on Intelligent Systems, pages 226–
240. Springer, 2023.
[305] Gabriel Lino Garcia, Pedro Henrique Paiola, Luis Henrique Morelli, Giovani Candido, Ar-
naldo Cândido Júnior, Danilo Samuel Jodas, Luis Afonso, Ivan Rizzo Guilherme, Bruno Elias
Penteado, and João Paulo Papa. Introducing bode: A fine-tuned large language model for por-
tuguese prompt-based task. arXiv preprint arXiv:2401.02909, 2024.
[306] Ayyoob ImaniGooghari, Peiqin Lin, Amir Hossein Kargaran, Silvia Severini, Masoud Jalili
Sabet, Nora Kassner, Chunlan Ma, Helmut Schmid, André FT Martins, François Yvon, et al.
Glot500: Scaling multilingual corpora and language models to 500 languages. arXiv preprint
arXiv:2305.12182, 2023.
[307] Abteen Ebrahimi and Katharina Kann. How to adapt your pretrained multilingual model to
1600 languages. arXiv preprint arXiv:2106.02124, 2021.
[308] Jesujoba O Alabi, David Ifeoluwa Adelani, Marius Mosbach, and Dietrich Klakow. Adapting
pre-trained language models to african languages via multilingual adaptive fine-tuning. arXiv
preprint arXiv:2204.06487, 2022.
[309] Niklas Muennighoff, Thomas Wang, Lintang Sutawika, Adam Roberts, Stella Biderman,
Teven Le Scao, M Saiful Bari, Sheng Shen, Zheng-Xin Yong, Hailey Schoelkopf, et al.
Crosslingual generalization through multitask finetuning. arXiv preprint arXiv:2211.01786,
2022.
[310] Xinyi Wang, Sebastian Ruder, and Graham Neubig. Expanding pretrained models to thou-
sands more languages via lexicon-based adaptation. arXiv preprint arXiv:2203.09435, 2022.
[311] Pranav Rajpurkar, Jian Zhang, Konstantin Lopyrev, and Percy Liang. Squad: 100,000+ ques-
tions for machine comprehension of text. In Proceedings of the 2016 Conference on Empirical
Methods in Natural Language Processing, pages 2383–2392, 2016.
[312] Wenpeng Yin, Dragomir Radev, and Caiming Xiong.
Docnli: A large-scale dataset for
document-level natural language inference. In Findings of the Association for Computational
Linguistics: ACL-IJCNLP 2021, pages 4913–4922, 2021.
[313] Naveen Arivazhagan, Ankur Bapna, Orhan Firat, Dmitry Lepikhin, Melvin Johnson, Maxim
Krikun, Mia Xu Chen, Yuan Cao, George Foster, Colin Cherry, et al.
Massively multi-
lingual neural machine translation in the wild: Findings and challenges.
arXiv preprint
arXiv:1907.05019, 2019.
[314] Xinyi Wang, Yulia Tsvetkov, and Graham Neubig. Balancing training for multilingual neu-
ral machine translation. In Proceedings of the 58th Annual Meeting of the Association for
Computational Linguistics, pages 8526–8537, 2020.
[315] Minghao Wu, Yitong Li, Meng Zhang, Liangyou Li, Gholamreza Haffari, and Qun Liu.
Uncertainty-aware balancing for multilingual and multi-domain neural machine translation
training. In Proceedings of the 2021 Conference on Empirical Methods in Natural Language
Processing, pages 7291–7305, 2021.
[316] Jian Yang, Yuwei Yin, Shuming Ma, Haoyang Huang, Dongdong Zhang, Zhoujun Li, and
Furu Wei. Multilingual agreement for multilingual neural machine translation. In Proceedings
of the 59th Annual Meeting of the Association for Computational Linguistics and the 11th
International Joint Conference on Natural Language Processing (Volume 2: Short Papers),
pages 233–239, 2021.
[317] Xiao Pan, Mingxuan Wang, Liwei Wu, and Lei Li. Contrastive learning for many-to-many
multilingual neural machine translation. In Proceedings of the 59th Annual Meeting of the
Association for Computational Linguistics and the 11th International Joint Conference on
Natural Language Processing (Volume 1: Long Papers), pages 244–258, 2021.
51
[318] Arturo Oncevay, Barry Haddow, and Alexandra Birch. Bridging linguistic typology and mul-
tilingual machine translation with multi-view language representations. In Proceedings of the
2020 Conference on Empirical Methods in Natural Language Processing (EMNLP), pages
2391–2406, 2020.
[319] Yong Cheng, Ankur Bapna, Orhan Firat, Yuan Cao, Pidong Wang, and Wolfgang Macherey.
Multilingual mix: Example interpolation improves multilingual neural machine translation.
In Proceedings of the 60th Annual Meeting of the Association for Computational Linguistics
(Volume 1: Long Papers), pages 4092–4102, 2022.
[320] David Stap, Vlad Niculae, and Christof Monz. Viewing knowledge transfer in multilingual
machine translation through a representational lens. In Findings of the Association for Com-
putational Linguistics: EMNLP 2023, pages 14973–14987, 2023.
[321] Qian Wang and Jiajun Zhang. Parameter differentiation based multilingual neural machine
translation. In Proceedings of the AAAI Conference on Artificial Intelligence, volume 36,
pages 11440–11448, 2022.
[322] Iz Beltagy, Matthew E Peters, and Arman Cohan. Longformer: The long-document trans-
former. arXiv preprint arXiv:2004.05150, 2020.
[323] Jianlin Su, Murtadha Ahmed, Yu Lu, Shengfeng Pan, Wen Bo, and Yunfeng Liu. Roformer:
Enhanced transformer with rotary position embedding. Neurocomputing, 568:127063, 2024.
[324] Zhiliang Peng, Wenhui Wang, Li Dong, Yaru Hao, Shaohan Huang, Shuming Ma, and Furu
Wei. Kosmos-2: Grounding multimodal large language models to the world. arXiv preprint
arXiv:2306.14824, 2023.
[325] Haotian Liu, Chunyuan Li, Qingyang Wu, and Yong Jae Lee.
Visual instruction tuning.
Advances in neural information processing systems, 36, 2024.
[326] Albert Gu and Tri Dao. Mamba: Linear-time sequence modeling with selective state spaces.
arXiv preprint arXiv:2312.00752, 2023.
[327] Libo Qin, Qiguang Chen, Fuxuan Wei, Shijue Huang, and Wanxiang Che. Cross-lingual
prompting: Improving zero-shot chain-of-thought reasoning across languages. In Proceed-
ings of the 2023 Conference on Empirical Methods in Natural Language Processing, pages
2695–2709, 2023.
[328] Julen Etxaniz, Gorka Azkune, Aitor Soroa, Oier Lopez de Lacalle, and Mikel Artetxe. Do
multilingual language models think better in english?
arXiv preprint arXiv:2308.01223,
2023.
[329] Maarten Sap, Vered Shwartz, Antoine Bosselut, Yejin Choi, and Dan Roth. Commonsense
reasoning for natural language processing. In Proceedings of the 58th Annual Meeting of the
Association for Computational Linguistics: Tutorial Abstracts, pages 27–33, 2020.
[330] Fei Yu, Hongbo Zhang, and Benyou Wang. Nature language reasoning, a survey. arXiv
preprint arXiv:2303.14725, 2023.
[331] Hanmeng Liu, Jian Liu, Leyang Cui, Zhiyang Teng, Nan Duan, Ming Zhou, and Yue Zhang.
Logiqa 2.0—an improved dataset for logical reasoning in natural language understanding.
IEEE/ACM Transactions on Audio, Speech, and Language Processing, 2023.
[332] Xuezhi Wang, Jason Wei, Dale Schuurmans, Quoc V Le, Ed H Chi, Sharan Narang,
Aakanksha Chowdhery, and Denny Zhou. Self-consistency improves chain of thought rea-
soning in language models. In The Eleventh International Conference on Learning Represen-
tations, 2022.
[333] Qing Lyu, Shreya Havaldar, Adam Stein, Li Zhang, Delip Rao, Eric Wong, Marianna Apidi-
anaki, and Chris Callison-Burch. Faithful chain-of-thought reasoning. In Proceedings of the
13th International Joint Conference on Natural Language Processing and the 3rd Conference
of the Asia-Pacific Chapter of the Association for Computational Linguistics (Volume 1: Long
Papers), pages 305–329, 2023.
52
[334] Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Fei Xia, Ed Chi, Quoc V Le,
Denny Zhou, et al. Chain-of-thought prompting elicits reasoning in large language models.
Advances in neural information processing systems, 35:24824–24837, 2022.
[335] Gustavo Aguilar, Sudipta Kar, and Thamar Solorio. Lince: A centralized benchmark for
linguistic code-switching evaluation. In Proceedings of the Twelfth Language Resources and
Evaluation Conference, pages 1803–1813, 2020.
[336] Vivek Srivastava and Mayank Singh. Overview and results of mixmt shared-task at wmt 2022.
In Proceedings of the Seventh Conference on Machine Translation (WMT), pages 806–811,
2022.
[337] Laiba Mehnaz, Debanjan Mahata, Rakesh Gosangi, Uma Sushmitha Gunturi, Riya Jain, Gauri
Gupta, Amardeep Kumar, Isabelle G Lee, Anish Acharya, and Rajiv Shah. Gupshup: Sum-
marizing open-domain code-switched conversations. In Proceedings of the 2021 Conference
on Empirical Methods in Natural Language Processing, pages 6177–6192, 2021.
[338] Ziqiang Zhang, Long Zhou, Chengyi Wang, Sanyuan Chen, Yu Wu, Shujie Liu, Zhuo Chen,
Yanqing Liu, Huaming Wang, Jinyu Li, et al. Speak foreign languages with your own voice:
Cross-lingual neural codec language modeling. arXiv preprint arXiv:2303.03926, 2023.
[339] Kuan-Po Huang, Chih-Kai Yang, Yu-Kuan Fu, Ewan Dunbar, and Hung-yi Lee. Zero re-
source code-switched speech benchmark using speech utterance pairs for multiple spoken
languages. In ICASSP 2024-2024 IEEE International Conference on Acoustics, Speech and
Signal Processing (ICASSP), pages 10006–10010. IEEE, 2024.
[340] A Seza Do˘gruöz, Sunayana Sitaram, Barbara Bullock, and Almeida Jacqueline Toribio. A
survey of code-switching: Linguistic and social perspectives for language technologies. In
Proceedings of the 59th Annual Meeting of the Association for Computational Linguistics and
the 11th International Joint Conference on Natural Language Processing (Volume 1: Long
Papers), pages 1654–1666, 2021.
[341] Genta Indra Winata, Samuel Cahyawijaya, Zihan Liu, Zhaojiang Lin, Andrea Madotto, and
Pascale Fung. Are multilingual models effective in code-switching? In Proceedings of the
Fifth Workshop on Computational Approaches to Linguistic Code-Switching, pages 142–153,
2021.
[342] Richeek Das, Sahasra Ranjan, Shreya Pathak, and Preethi Jyothi.
Improving pretraining
techniques for code-switched NLP.
In Anna Rogers, Jordan Boyd-Graber, and Naoaki
Okazaki, editors, Proceedings of the 61st Annual Meeting of the Association for Compu-
tational Linguistics (Volume 1: Long Papers), pages 1176–1191, Toronto, Canada, July
2023. Association for Computational Linguistics. doi: 10.18653/v1/2023.acl-long.66. URL
https://aclanthology.org/2023.acl-long.66.
[343] Yunfan Gao, Yun Xiong, Xinyu Gao, Kangxiang Jia, Jinliu Pan, Yuxi Bi, Yi Dai, Jiawei Sun,
and Haofen Wang. Retrieval-augmented generation for large language models: A survey.
arXiv preprint arXiv:2312.10997, 2023.
[344] Zhiwei He, Tian Liang, Wenxiang Jiao, Zhuosheng Zhang, Yujiu Yang, Rui Wang, Zhaopeng
Tu, Shuming Shi, and Xing Wang.
Exploring human-like translation strategy with large
language models, 2023.
[345] Angela Fan, Shruti Bhosale, Holger Schwenk, Zhiyi Ma, Ahmed El-Kishky, Siddharth Goyal,
Mandeep Baines, Onur Celebi, Guillaume Wenzek, Vishrav Chaudhary, et al.
Beyond
english-centric multilingual machine translation. Journal of Machine Learning Research,
22:1–48, 2021.
[346] Jason Wei, Yi Tay, Rishi Bommasani, Colin Raffel, Barret Zoph, Sebastian Borgeaud, Dani
Yogatama, Maarten Bosma, Denny Zhou, Donald Metzler, et al. Emergent abilities of large
language models. arXiv preprint arXiv:2206.07682, 2022.
[347] Alexandre Magueresse, Vincent Carles, and Evan Heetderks. Low-resource languages: A
review of past work and future challenges. arXiv preprint arXiv:2006.07264, 2020.
53
[348] Surangika Ranathunga, En-Shiun Annie Lee, Marjana Prifti Skenduli, Ravi Shekhar,
Mehreen Alam, and Rishemjit Kaur. Neural machine translation for low-resource languages:
A survey. ACM Computing Surveys, 55:1–37, 2023.
[349] Antonio Valerio Miceli-Barone, Barry Haddow, Ulrich Germann, and Rico Sennrich. Reg-
ularization techniques for fine-tuning in neural machine translation. In Proceedings of the
2017 Conference on Empirical Methods in Natural Language Processing, pages 1489–1494,
2017.
[350] Raj Dabre, Atsushi Fujita, and Chenhui Chu. Exploiting multilingualism through multistage
fine-tuning for low-resource neural machine translation. In Proceedings of the 2019 Confer-
ence on Empirical Methods in Natural Language Processing and the 9th International Joint
Conference on Natural Language Processing (EMNLP-IJCNLP), pages 1410–1416, 2019.
[351] Ankur Bapna and Orhan Firat. Simple, scalable adaptation for neural machine translation.
In Proceedings of the 2019 Conference on Empirical Methods in Natural Language Process-
ing and the 9th International Joint Conference on Natural Language Processing (EMNLP-
IJCNLP), pages 1538–1548, 2019.
[352] Christopher D. Manning, Prabhakar Raghavan, and Hinrich Schütze. Introduction to Infor-
mation Retrieval. Cambridge University Press, 2008.
[353] Christian Fluhr, Robert E Frederking, Doug Oard, Akitoshi Okumura, Kai Ishikawa, and
Kenji Satoh. 2.1 multilingual information retrieval. 1995.
[354] Douglas W Oard and Anne R Diekema. Cross-language information retrieval. Annual Review
of Information Science and Technology (ARIST), 33:223–56, 1998.
[355] Jian-Yun Nie, Michel Simard, Pierre Isabelle, and Richard Durand. Cross-language infor-
mation retrieval based on parallel texts and automatic mining of parallel texts from the web.
In Proceedings of the 22nd annual international ACM SIGIR conference on Research and
development in information retrieval, pages 74–81, 1999.
[356] Vera Hollink, Jaap Kamps, Christof Monz, and Maarten De Rijke. Monolingual document
retrieval for european languages. Information retrieval, 7:33–52, 2004.
[357] Wei Gao, Cheng Niu, Jian-Yun Nie, Ming Zhou, Jian Hu, Kam-Fai Wong, and Hsiao-Wuen
Hon. Cross-lingual query suggestion using query logs of different languages. In Proceedings
of the 30th annual international ACM SIGIR conference on Research and development in
information retrieval, pages 463–470, 2007.
[358] Gregory Grefenstette. Cross-language information retrieval, volume 2. Springer Science &
Business Media, 2012.
[359] Carol Peters, Martin Braschler, and Paul Clough. Multilingual information retrieval: From
research to practice. Springer, 2012.
[360] Jian-Yun Nie. Cross-language information retrieval. Springer Nature, 2022.
[361] Dawn Lawrie, James Mayfield, Douglas W. Oard, and Eugene Yang. Hc4: A new suite of test
collections for ad hoc clir. In Matthias Hagen, Suzan Verberne, Craig Macdonald, Christin
Seifert, Krisztian Balog, Kjetil Nørvåg, and Vinay Setty, editors, Advances in Information
Retrieval, pages 351–366, Cham, 2022. Springer International Publishing. ISBN 978-3-030-
99736-6.
[362] Jimmy Lin, Rodrigo Nogueira, and Andrew Yates. Pretrained transformers for text ranking:
Bert and beyond. Springer Nature, 2022.
[363] Qingyao Ai, Ting Bai, Zhao Cao, Yi Chang, Jiawei Chen, Zhumin Chen, Zhiyong Cheng,
Shoubin Dong, Zhicheng Dou, Fuli Feng, Shen Gao, Jiafeng Guo, Xiangnan He, Yanyan
Lan, Chenliang Li, Yiqun Liu, Ziyu Lyu, Weizhi Ma, Jun Ma, Zhaochun Ren, Pengjie Ren,
Zhiqiang Wang, Mingwen Wang, Ji-Rong Wen, Le Wu, Xin Xin, Jun Xu, Dawei Yin, Peng
Zhang, Fan Zhang, Weinan Zhang, Min Zhang, and Xiaofei Zhu. Information retrieval meets
54
large language models: A strategic report from chinese ir community. AI Open, 4:80–90,
2023. ISSN 2666-6510. doi: https://doi.org/10.1016/j.aiopen.2023.08.001. URL https://
www.sciencedirect.com/science/article/pii/S2666651023000049.
[364] Yutao Zhu, Huaying Yuan, Shuting Wang, Jiongnan Liu, Wenhan Liu, Chenlong Deng, Hao-
nan Chen, Zheng Liu, Zhicheng Dou, and Ji-Rong Wen. Large language models for informa-
tion retrieval: A survey, 2024. URL https://arxiv.org/abs/2308.07107.
[365] Zheng Liu, Yujia Zhou, Yutao Zhu, Jianxun Lian, Chaozhuo Li, Zhicheng Dou, Defu
Lian, and Jian-Yun Nie. Information retrieval meets large language models. In Compan-
ion Proceedings of the ACM Web Conference 2024, WWW ’24, page 1586–1589, New
York, NY, USA, 2024. Association for Computing Machinery. ISBN 9798400701726. doi:
10.1145/3589335.3641299. URL https://doi.org/10.1145/3589335.3641299.
[366] Saiful Haq, Ashutosh Sharma, Omar Khattab, Niyati Chhaya, and Pushpak Bhattacharyya.
IndicIRSuite: Multilingual dataset and neural information models for Indian languages. In
Lun-Wei Ku, Andre Martins, and Vivek Srikumar, editors, Proceedings of the 62nd Annual
Meeting of the Association for Computational Linguistics (Volume 2: Short Papers), pages
501–509, Bangkok, Thailand, August 2024. Association for Computational Linguistics. doi:
10.18653/v1/2024.acl-short.46. URL https://aclanthology.org/2024.acl-short.46.
[367] Gautier Izacard, Mathilde Caron, Lucas Hosseini, Sebastian Riedel, Piotr Bojanowski, Ar-
mand Joulin, and Edouard Grave. Unsupervised dense information retrieval with contrastive
learning, 2021. URL https://arxiv.org/abs/2112.09118.
[368] Liang Wang, Nan Yang, Xiaolong Huang, Binxing Jiao, Linjun Yang, Daxin Jiang, Rangan
Majumder, and Furu Wei. Text embeddings by weakly-supervised contrastive pre-training,
2024. URL https://arxiv.org/abs/2212.03533.
[369] Holger Schwenk, Guillaume Wenzek, Sergey Edunov, Edouard Grave, Armand Joulin, and
Angela Fan. CCMatrix: Mining billions of high-quality parallel sentences on the web. In
Proceedings of the 59th Annual Meeting of the Association for Computational Linguistics and
the 11th International Joint Conference on Natural Language Processing (Volume 1: Long
Papers), pages 6490–6500, Online, August 2021. Association for Computational Linguistics.
doi: 10.18653/v1/2021.acl-long.507. URL https://aclanthology.org/2021.acl-long.507.
[370] Ahmed El-Kishky, Vishrav Chaudhary, Francisco Guzmán, and Philipp Koehn. CCAligned:
A massive collection of cross-lingual web-document pairs. In Proceedings of the 2020 Con-
ference on Empirical Methods in Natural Language Processing (EMNLP), pages 5960–5969,
Online, November 2020. Association for Computational Linguistics. doi: 10.18653/v1/2020.
emnlp-main.480. URL https://aclanthology.org/2020.emnlp-main.480.
[371] Jimmy Lin and Xueguang Ma. A few brief notes on deepimpact, coil, and a conceptual
framework for information retrieval techniques. arXiv preprint arXiv:2106.14807, 2021.
[372] Stephen Robertson and Hugo Zaragoza. The probabilistic relevance framework: BM25 and
beyond. Foundation and Trends in Information Retrieval, 3(4):333–389, April 2009. ISSN
1554-0669.
[373] Xinyu Zhang, Xueguang Ma, Peng Shi, and Jimmy Lin. Mr. TyDi: A multi-lingual bench-
mark for dense retrieval.
In Proceedings of the 1st Workshop on Multilingual Represen-
tation Learning, pages 127–137, Punta Cana, Dominican Republic, November 2021. As-
sociation for Computational Linguistics.
doi: 10.18653/v1/2021.mrl-1.12.
URL https:
//aclanthology.org/2021.mrl-1.12.
[374] David A Hull and Gregory Grefenstette. Querying across languages: A dictionary-based ap-
proach to multilingual information retrieval. In Proceedings of the 19th annual international
ACM SIGIR conference on Research and development in information retrieval, pages 49–57,
1996.
[375] Dong Zhou, Mark Truran, Tim Brailsford, Vincent Wade, and Helen Ashman. Translation
techniques in cross-language information retrieval. ACM Computing Surveys (CSUR), 45(1):
1–44, 2012.
55
[376] Jimmy Lin, David Alfonso-Hermelo, Vitor Jeronymo, Ehsan Kamalloo, Carlos Lassance, Ro-
drigo Nogueira, Odunayo Ogundepo, Mehdi Rezagholizadeh, Nandan Thakur, Jheng-Hong
Yang, and Xinyu Zhang. Simple yet effective neural ranking and reranking baselines for
cross-lingual information retrieval, 2023. URL https://arxiv.org/abs/2304.01019.
[377] Zhuyun Dai and Jamie Callan. Context-aware sentence/passage term importance estimation
for first stage retrieval, 2019. URL https://arxiv.org/abs/1910.10687.
[378] Luyu Gao, Zhuyun Dai, and Jamie Callan. COIL: Revisit exact lexical match in information
retrieval with contextualized inverted list. In Proceedings of the 2021 Conference of the North
American Chapter of the Association for Computational Linguistics: Human Language Tech-
nologies, pages 3030–3042, Online, June 2021. Association for Computational Linguistics.
doi: 10.18653/v1/2021.naacl-main.241. URL https://aclanthology.org/2021.naacl-main.241.
[379] Thibault Formal, Benjamin Piwowarski, and Stéphane Clinchant. SPLADE: Sparse Lexical
and Expansion Model for First Stage Ranking, page 2288–2292. Association for Computing
Machinery, New York, NY, USA, 2021. ISBN 9781450380379. URL https://doi.org/10.1145/
3404835.3463098.
[380] Thibault Formal, Carlos Lassance, Benjamin Piwowarski, and Stéphane Clinchant. Splade
v2: Sparse lexical and expansion model for information retrieval, 2021. URL https://arxiv.
org/abs/2109.10086.
[381] Thibault Formal, Carlos Lassance, Benjamin Piwowarski, and Stéphane Clinchant. From
distillation to hard negative sampling: Making sparse neural ir models more effective. In
Proceedings of the 45th International ACM SIGIR Conference on Research and Development
in Information Retrieval, SIGIR ’22, page 2353–2359, New York, NY, USA, 2022. Associ-
ation for Computing Machinery. ISBN 9781450387323. doi: 10.1145/3477495.3531857.
URL https://doi.org/10.1145/3477495.3531857.
[382] Carlos Lassance and Stéphane Clinchant. An efficiency study for splade models. In Pro-
ceedings of the 45th International ACM SIGIR Conference on Research and Development in
Information Retrieval, SIGIR ’22, page 2220–2226, New York, NY, USA, 2022. Association
for Computing Machinery. ISBN 9781450387323. doi: 10.1145/3477495.3531833. URL
https://doi.org/10.1145/3477495.3531833.
[383] Carlos Lassance. Extending english ir methods to multi-lingual ir, 2023. URL https://arxiv.
org/abs/2302.14723.
[384] Alexis Conneau, Kartikay Khandelwal, Naman Goyal, Vishrav Chaudhary, Guillaume Wen-
zek, Francisco Guzmán, Edouard Grave, Myle Ott, Luke Zettlemoyer, and Veselin Stoyanov.
Unsupervised cross-lingual representation learning at scale, 2020. URL https://arxiv.org/abs/
1911.02116.
[385] Suraj Nair, Eugene Yang, Dawn Lawrie, James Mayfield, and Douglas W. Oard. Blade:
Combining vocabulary pruning and intermediate pretraining for scaleable neural clir. In Pro-
ceedings of the 46th International ACM SIGIR Conference on Research and Development in
Information Retrieval, SIGIR ’23, page 1219–1229, New York, NY, USA, 2023. Association
for Computing Machinery. ISBN 9781450394086. doi: 10.1145/3539618.3591644. URL
https://doi.org/10.1145/3539618.3591644.
[386] Akari Asai, Jungo Kasai, Jonathan Clark, Kenton Lee, Eunsol Choi, and Hannaneh Ha-
jishirzi.
XOR QA: Cross-lingual open-retrieval question answering.
In Proceedings of
the 2021 Conference of the North American Chapter of the Association for Computational
Linguistics: Human Language Technologies, pages 547–564, Online, June 2021. Associ-
ation for Computational Linguistics.
doi: 10.18653/v1/2021.naacl-main.46.
URL https:
//aclanthology.org/2021.naacl-main.46.
[387] Xinyu Zhang, Kelechi Ogueji, Xueguang Ma, and Jimmy Lin. Toward best practices for
training multilingual dense retrieval models. ACM Trans. Inf. Syst., 42(2), September 2023.
ISSN 1046-8188. doi: 10.1145/3613447. URL https://doi.org/10.1145/3613447.
56
[388] Yulong Li, Martin Franz, Md Arafat Sultan, Bhavani Iyer, Young-Suk Lee, and Avirup
Sil.
Learning cross-lingual IR from an English retriever.
In Proceedings of the 2022
Conference of the North American Chapter of the Association for Computational Linguis-
tics: Human Language Technologies, pages 4428–4436, Seattle, United States, July 2022.
Association for Computational Linguistics. doi: 10.18653/v1/2022.naacl-main.329. URL
https://aclanthology.org/2022.naacl-main.329.
[389] Omar Khattab and Matei Zaharia. Colbert: Efficient and effective passage search via con-
textualized late interaction over bert. In Proceedings of the 43rd International ACM SIGIR
Conference on Research and Development in Information Retrieval, SIGIR ’20, page 39–48,
New York, NY, USA, 2020. Association for Computing Machinery. ISBN 9781450380164.
doi: 10.1145/3397271.3401075. URL https://doi.org/10.1145/3397271.3401075.
[390] Sean MacAvaney, Luca Soldaini, and Nazli Goharian. Teaching a new dog old tricks: Res-
urrecting multilingual retrieval using zero-shot learning. In Advances in Information Re-
trieval: 42nd European Conference on IR Research, ECIR 2020, Lisbon, Portugal, April
14–17, 2020, Proceedings, Part II, page 246–254, Berlin, Heidelberg, 2020. Springer-Verlag.
ISBN 978-3-030-45441-8. doi: 10.1007/978-3-030-45442-5_31. URL https://doi.org/10.
1007/978-3-030-45442-5_31.
[391] Peng Shi and Jimmy Lin. Cross-lingual relevance transfer for document retrieval, 2019. URL
https://arxiv.org/abs/1911.02989.
[392] Peng Shi, He Bai, and Jimmy Lin. Cross-lingual training of neural models for document
ranking. In Findings of the Association for Computational Linguistics: EMNLP 2020, pages
2768–2773, Online, November 2020. Association for Computational Linguistics. doi: 10.
18653/v1/2020.findings-emnlp.249. URL https://aclanthology.org/2020.findings-emnlp.249.
[393] Mofetoluwa Adeyemi, Akintunde Oladipo, Xinyu Zhang, David Alfonso-Hermelo, Mehdi
Rezagholizadeh, Boxing Chen, Abdul-Hakeem Omotayo, Idris Abdulmumin, Naome A.
Etori, Toyib Babatunde Musa, Samuel Fanijo, Oluwabusayo Olufunke Awoyomi, Saheed Ab-
dullahi Salahudeen, Labaran Adamu Mohammed, Daud Olamide Abolade, Falalu Ibrahim
Lawan, Maryam Sabo Abubakar, Ruqayya Nasir Iro, Amina Imam Abubakar, Shafie Abdi
Mohamed, Hanad Mohamud Mohamed, Tunde Oluwaseyi Ajayi, and Jimmy Lin. Ciral: A
test collection for clir evaluations in african languages. In Proceedings of the 47th Inter-
national ACM SIGIR Conference on Research and Development in Information Retrieval,
SIGIR ’24, page 293–302, New York, NY, USA, 2024. Association for Computing Machin-
ery. ISBN 9798400704314. doi: 10.1145/3626772.3657884. URL https://doi.org/10.1145/
3626772.3657884.
[394] Xiaoxi Li, Jiajie Jin, Yujia Zhou, Yuyao Zhang, Peitian Zhang, Yutao Zhu, and Zhicheng
Dou. From matching to generation: A survey on generative information retrieval, 2024. URL
https://arxiv.org/abs/2404.14851.
[395] Jinhyuk Lee, Anthony Chen, Zhuyun Dai, Dheeru Dua, Devendra Singh Sachan, Michael
Boratko, Yi Luan, Sébastien M. R. Arnold, Vincent Perot, Siddharth Dalmia, Hexiang Hu,
Xudong Lin, Panupong Pasupat, Aida Amini, Jeremy R. Cole, Sebastian Riedel, Iftekhar
Naim, Ming-Wei Chang, and Kelvin Guu. Can long-context language models subsume re-
trieval, RAG, SQL, and more?, 2024. URL https://arxiv.org/abs/2406.13121.
[396] Manveer Singh Tamber, Ronak Pradeep, and Jimmy Lin. Scaling Down, LiTting Up: Efficient
zero-shot listwise reranking with seq2seq encoder-decoder models, 2023. URL https://arxiv.
org/abs/2312.16098.
[397] Aaron Grattafiori, Abhimanyu Dubey, Abhinav Jauhri, Abhinav Pandey, Abhishek Kadian,
Ahmad Al-Dahle, Aiesha Letman, Akhil Mathur, Alan Schelten, Alex Vaughan, Amy Yang,
Angela Fan, Anirudh Goyal, Anthony Hartshorn, Aobo Yang, Archi Mitra, Archie Sravanku-
mar, Artem Korenev, Arthur Hinsvark, Arun Rao, Aston Zhang, Aurelien Rodriguez, Austen
Gregerson, Ava Spataru, Baptiste Roziere, Bethany Biron, Binh Tang, Bobbie Chern, Char-
lotte Caucheteux, Chaya Nayak, Chloe Bi, Chris Marra, Chris McConnell, Christian Keller,
Christophe Touret, Chunyang Wu, Corinne Wong, Cristian Canton Ferrer, Cyrus Nikolaidis,
57
Damien Allonsius, Daniel Song, Danielle Pintz, Danny Livshits, Danny Wyatt, David Es-
iobu, Dhruv Choudhary, Dhruv Mahajan, Diego Garcia-Olano, Diego Perino, Dieuwke Hup-
kes, Egor Lakomkin, Ehab AlBadawy, Elina Lobanova, Emily Dinan, Eric Michael Smith,
Filip Radenovic, Francisco Guzmán, Frank Zhang, Gabriel Synnaeve, Gabrielle Lee, Geor-
gia Lewis Anderson, Govind Thattai, Graeme Nail, Gregoire Mialon, Guan Pang, Guillem
Cucurell, Hailey Nguyen, Hannah Korevaar, Hu Xu, Hugo Touvron, Iliyan Zarov, Imanol Ar-
rieta Ibarra, Isabel Kloumann, Ishan Misra, Ivan Evtimov, Jack Zhang, Jade Copet, Jaewon
Lee, Jan Geffert, Jana Vranes, Jason Park, Jay Mahadeokar, Jeet Shah, Jelmer van der Linde,
Jennifer Billock, Jenny Hong, Jenya Lee, Jeremy Fu, Jianfeng Chi, Jianyu Huang, Jiawen
Liu, Jie Wang, Jiecao Yu, Joanna Bitton, Joe Spisak, Jongsoo Park, Joseph Rocca, Joshua
Johnstun, Joshua Saxe, Junteng Jia, Kalyan Vasuden Alwala, Karthik Prasad, Kartikeya Up-
asani, Kate Plawiak, Ke Li, Kenneth Heafield, Kevin Stone, Khalid El-Arini, Krithika Iyer,
Kshitiz Malik, Kuenley Chiu, Kunal Bhalla, Kushal Lakhotia, Lauren Rantala-Yeary, Lau-
rens van der Maaten, Lawrence Chen, Liang Tan, Liz Jenkins, Louis Martin, Lovish Madaan,
Lubo Malo, Lukas Blecher, Lukas Landzaat, Luke de Oliveira, Madeline Muzzi, Mahesh Pa-
supuleti, Mannat Singh, Manohar Paluri, Marcin Kardas, Maria Tsimpoukelli, Mathew Old-
ham, Mathieu Rita, Maya Pavlova, Melanie Kambadur, Mike Lewis, Min Si, Mitesh Kumar
Singh, Mona Hassan, Naman Goyal, Narjes Torabi, Nikolay Bashlykov, Nikolay Bogoychev,
Niladri Chatterji, Ning Zhang, Olivier Duchenne, Onur Çelebi, Patrick Alrassy, Pengchuan
Zhang, Pengwei Li, Petar Vasic, Peter Weng, Prajjwal Bhargava, Pratik Dubal, Praveen Krish-
nan, Punit Singh Koura, Puxin Xu, Qing He, Qingxiao Dong, Ragavan Srinivasan, Raj Gana-
pathy, Ramon Calderer, Ricardo Silveira Cabral, Robert Stojnic, Roberta Raileanu, Rohan
Maheswari, Rohit Girdhar, Rohit Patel, Romain Sauvestre, Ronnie Polidoro, Roshan Sum-
baly, Ross Taylor, Ruan Silva, Rui Hou, Rui Wang, Saghar Hosseini, Sahana Chennabasappa,
Sanjay Singh, Sean Bell, Seohyun Sonia Kim, Sergey Edunov, Shaoliang Nie, Sharan Narang,
Sharath Raparthy, Sheng Shen, Shengye Wan, Shruti Bhosale, Shun Zhang, Simon Vanden-
hende, Soumya Batra, Spencer Whitman, Sten Sootla, Stephane Collot, Suchin Gururangan,
Sydney Borodinsky, Tamar Herman, Tara Fowler, Tarek Sheasha, Thomas Georgiou, Thomas
Scialom, Tobias Speckbacher, Todor Mihaylov, Tong Xiao, Ujjwal Karn, Vedanuj Goswami,
Vibhor Gupta, Vignesh Ramanathan, Viktor Kerkez, Vincent Gonguet, Virginie Do, Vish
Vogeti, Vítor Albiero, Vladan Petrovic, Weiwei Chu, Wenhan Xiong, Wenyin Fu, Whitney
Meers, Xavier Martinet, Xiaodong Wang, Xiaofang Wang, Xiaoqing Ellen Tan, Xide Xia,
Xinfeng Xie, Xuchao Jia, Xuewei Wang, Yaelle Goldschlag, Yashesh Gaur, Yasmine Babaei,
Yi Wen, Yiwen Song, Yuchen Zhang, Yue Li, Yuning Mao, Zacharie Delpierre Coudert,
Zheng Yan, Zhengxing Chen, Zoe Papakipos, Aaditya Singh, Aayushi Srivastava, Abha Jain,
Adam Kelsey, Adam Shajnfeld, Adithya Gangidi, Adolfo Victoria, Ahuva Goldstand, Ajay
Menon, Ajay Sharma, Alex Boesenberg, Alexei Baevski, Allie Feinstein, Amanda Kallet,
Amit Sangani, Amos Teo, Anam Yunus, Andrei Lupu, Andres Alvarado, Andrew Caples,
Andrew Gu, Andrew Ho, Andrew Poulton, Andrew Ryan, Ankit Ramchandani, Annie Dong,
Annie Franco, Anuj Goyal, Aparajita Saraf, Arkabandhu Chowdhury, Ashley Gabriel, Ash-
win Bharambe, Assaf Eisenman, Azadeh Yazdan, Beau James, Ben Maurer, Benjamin Leon-
hardi, Bernie Huang, Beth Loyd, Beto De Paola, Bhargavi Paranjape, Bing Liu, Bo Wu, Boyu
Ni, Braden Hancock, Bram Wasti, Brandon Spence, Brani Stojkovic, Brian Gamido, Britt
Montalvo, Carl Parker, Carly Burton, Catalina Mejia, Ce Liu, Changhan Wang, Changkyu
Kim, Chao Zhou, Chester Hu, Ching-Hsiang Chu, Chris Cai, Chris Tindal, Christoph Fe-
ichtenhofer, Cynthia Gao, Damon Civin, Dana Beaty, Daniel Kreymer, Daniel Li, David
Adkins, David Xu, Davide Testuggine, Delia David, Devi Parikh, Diana Liskovich, Didem
Foss, Dingkang Wang, Duc Le, Dustin Holland, Edward Dowling, Eissa Jamil, Elaine Mont-
gomery, Eleonora Presani, Emily Hahn, Emily Wood, Eric-Tuan Le, Erik Brinkman, Es-
teban Arcaute, Evan Dunbar, Evan Smothers, Fei Sun, Felix Kreuk, Feng Tian, Filippos
Kokkinos, Firat Ozgenel, Francesco Caggioni, Frank Kanayet, Frank Seide, Gabriela Med-
ina Florez, Gabriella Schwarz, Gada Badeer, Georgia Swee, Gil Halpern, Grant Herman,
Grigory Sizov, Guangyi, Zhang, Guna Lakshminarayanan, Hakan Inan, Hamid Shojanaz-
eri, Han Zou, Hannah Wang, Hanwen Zha, Haroun Habeeb, Harrison Rudolph, Helen Suk,
Henry Aspegren, Hunter Goldman, Hongyuan Zhan, Ibrahim Damlaj, Igor Molybog, Igor
Tufanov, Ilias Leontiadis, Irina-Elena Veliche, Itai Gat, Jake Weissman, James Geboski,
James Kohli, Janice Lam, Japhet Asher, Jean-Baptiste Gaya, Jeff Marcus, Jeff Tang, Jen-
nifer Chan, Jenny Zhen, Jeremy Reizenstein, Jeremy Teboul, Jessica Zhong, Jian Jin, Jingyi
Yang, Joe Cummings, Jon Carvill, Jon Shepard, Jonathan McPhie, Jonathan Torres, Josh
58
Ginsburg, Junjie Wang, Kai Wu, Kam Hou U, Karan Saxena, Kartikay Khandelwal, Katay-
oun Zand, Kathy Matosich, Kaushik Veeraraghavan, Kelly Michelena, Keqian Li, Kiran Ja-
gadeesh, Kun Huang, Kunal Chawla, Kyle Huang, Lailin Chen, Lakshya Garg, Lavender A,
Leandro Silva, Lee Bell, Lei Zhang, Liangpeng Guo, Licheng Yu, Liron Moshkovich, Luca
Wehrstedt, Madian Khabsa, Manav Avalani, Manish Bhatt, Martynas Mankus, Matan Has-
son, Matthew Lennie, Matthias Reso, Maxim Groshev, Maxim Naumov, Maya Lathi, Meghan
Keneally, Miao Liu, Michael L. Seltzer, Michal Valko, Michelle Restrepo, Mihir Patel, Mik
Vyatskov, Mikayel Samvelyan, Mike Clark, Mike Macey, Mike Wang, Miquel Jubert Her-
moso, Mo Metanat, Mohammad Rastegari, Munish Bansal, Nandhini Santhanam, Natascha
Parks, Natasha White, Navyata Bawa, Nayan Singhal, Nick Egebo, Nicolas Usunier, Nikhil
Mehta, Nikolay Pavlovich Laptev, Ning Dong, Norman Cheng, Oleg Chernoguz, Olivia Hart,
Omkar Salpekar, Ozlem Kalinli, Parkin Kent, Parth Parekh, Paul Saab, Pavan Balaji, Pedro
Rittner, Philip Bontrager, Pierre Roux, Piotr Dollar, Polina Zvyagina, Prashant Ratanchan-
dani, Pritish Yuvraj, Qian Liang, Rachad Alao, Rachel Rodriguez, Rafi Ayub, Raghotham
Murthy, Raghu Nayani, Rahul Mitra, Rangaprabhu Parthasarathy, Raymond Li, Rebekkah
Hogan, Robin Battey, Rocky Wang, Russ Howes, Ruty Rinott, Sachin Mehta, Sachin Siby,
Sai Jayesh Bondu, Samyak Datta, Sara Chugh, Sara Hunt, Sargun Dhillon, Sasha Sidorov,
Satadru Pan, Saurabh Mahajan, Saurabh Verma, Seiji Yamamoto, Sharadh Ramaswamy,
Shaun Lindsay, Shaun Lindsay, Sheng Feng, Shenghao Lin, Shengxin Cindy Zha, Shishir
Patil, Shiva Shankar, Shuqiang Zhang, Shuqiang Zhang, Sinong Wang, Sneha Agarwal, Soji
Sajuyigbe, Soumith Chintala, Stephanie Max, Stephen Chen, Steve Kehoe, Steve Satter-
field, Sudarshan Govindaprasad, Sumit Gupta, Summer Deng, Sungmin Cho, Sunny Virk,
Suraj Subramanian, Sy Choudhury, Sydney Goldman, Tal Remez, Tamar Glaser, Tamara
Best, Thilo Koehler, Thomas Robinson, Tianhe Li, Tianjun Zhang, Tim Matthews, Timothy
Chou, Tzook Shaked, Varun Vontimitta, Victoria Ajayi, Victoria Montanez, Vijai Mohan,
Vinay Satish Kumar, Vishal Mangla, Vlad Ionescu, Vlad Poenaru, Vlad Tiberiu Mihailescu,
Vladimir Ivanov, Wei Li, Wenchen Wang, Wenwen Jiang, Wes Bouaziz, Will Constable, Xi-
aocheng Tang, Xiaojian Wu, Xiaolan Wang, Xilun Wu, Xinbo Gao, Yaniv Kleinman, Yanjun
Chen, Ye Hu, Ye Jia, Ye Qi, Yenda Li, Yilin Zhang, Ying Zhang, Yossi Adi, Youngjin Nam,
Yu, Wang, Yu Zhao, Yuchen Hao, Yundi Qian, Yunlu Li, Yuzi He, Zach Rait, Zachary DeVito,
Zef Rosnbrick, Zhaoduo Wen, Zhenyu Yang, Zhiwei Zhao, and Zhiyu Ma. The llama 3 herd
of models, 2024. URL https://arxiv.org/abs/2407.21783.
[398] Jiahao Yu, Xingwei Lin, Zheng Yu, and Xinyu Xing. Gptfuzzer: Red teaming large language
models with auto-generated jailbreak prompts, 2023.
[399] Xuan Li, Zhanke Zhou, Jianing Zhu, Jiangchao Yao, Tongliang Liu, and Bo Han. Deepin-
ception: Hypnotize large language model to be jailbreaker. arXiv preprint arXiv:2311.03191,
2023.
[400] Zeming Wei, Yifei Wang, and Yisen Wang. Jailbreak and guard aligned language models
with only few in-context demonstrations. arXiv preprint arXiv:2310.06387, 2023.
[401] Patrick Chao, Alexander Robey, Edgar Dobriban, Hamed Hassani, George J Pappas, and
Eric Wong. Jailbreaking black box large language models in twenty queries. In R0-FoMo:
Robustness of Few-shot and Zero-shot Learning in Large Foundation Models, 2023.
[402] Peng Ding, Jun Kuang, Dan Ma, Xuezhi Cao, Yunsen Xian, Jiajun Chen, and Shujian Huang.
A wolf in sheep’s clothing: Generalized nested jailbreak prompts can fool large language
models easily. arXiv preprint arXiv:2311.08268, 2023.
[403] Huijie Lv, Xiao Wang, Yuansen Zhang, Caishuang Huang, Shihan Dou, Junjie Ye, Tao Gui,
Qi Zhang, and Xuanjing Huang. Codechameleon: Personalized encryption framework for
jailbreaking large language models. arXiv preprint arXiv:2402.16717, 2024.
[404] Weikang Zhou, Xiao Wang, Limao Xiong, Han Xia, Yingshuang Gu, Mingxu Chai, Fukang
Zhu, Caishuang Huang, Shihan Dou, Zhiheng Xi, et al. Easyjailbreak: A unified framework
for jailbreaking large language models. arXiv preprint arXiv:2403.12171, 2024.
[405] Jelena Mirkovic, Peter Reiher, Christos Papadopoulos, Alefiya Hussain, Marla Shepard,
Michael Berg, and Robert Jung. Testing a collaborative ddos defense in a red team/blue
team exercise. IEEE Transactions on Computers, 57:1098–1112, 2008.
59
[406] Anay Mehrotra, Manolis Zampetakis, Paul Kassianik, Blaine Nelson, Hyrum Anderson,
Yaron Singer, and Amin Karbasi. Tree of attacks: Jailbreaking black-box llms automatically.
arXiv preprint arXiv:2312.02119, 2023.
[407] Rishabh Bhardwaj and Soujanya Poria. Red-teaming large language models using chain of
utterances for safety-alignment. arXiv preprint arXiv:2308.09662, 2023.
[408] Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell, Jackson Kernion, Andy
Jones, Anna Chen, Anna Goldie, Azalia Mirhoseini, Cameron McKinnon, et al. Constitu-
tional ai: Harmlessness from ai feedback. arXiv preprint arXiv:2212.08073, 2022.
[409] John Sweller. Cognitive load during problem solving: Effects on learning. Cognitive science,
12:257–285, 1988.
[410] John Sweller. Cognitive load theory. In Psychology of learning and motivation, volume 55,
pages 37–76. Elsevier, 2011.
[411] Adam Szulewski, Daniel Howes, Jeroen JG van Merriënboer, and John Sweller. From theory
to practice: the application of cognitive load theory to the practice of medicine. Academic
Medicine, 96:24–30, 2021.
[412] Erfan Shayegani, Yue Dong, and Nael Abu-Ghazaleh. Jailbreak in pieces: Compositional
adversarial attacks on multi-modal language models. In The Twelfth International Conference
on Learning Representations, 2023.
[413] Peng Gao, Jiaming Han, Renrui Zhang, Ziyi Lin, Shijie Geng, Aojun Zhou, Wei Zhang, Pan
Lu, Conghui He, Xiangyu Yue, et al. Llama-adapter v2: Parameter-efficient visual instruction
model. arXiv preprint arXiv:2304.15010, 2023.
[414] Javier Rando and Florian Tramèr. Universal jailbreak backdoors from poisoned human feed-
back. In The Twelfth International Conference on Learning Representations, 2023.
[415] Yotam Wolf, Noam Wies, Yoav Levine, and Amnon Shashua. Fundamental limitations of
alignment in large language models. arXiv preprint arXiv:2304.11082, 2023.
[416] Alex Albert. Jailbreak chat. https://www.jailbreakchat.com, 2023. Accessed: 2024-02-20.
[417] Patrick Chao, Edoardo Debenedetti, Alexander Robey, Maksym Andriushchenko, Francesco
Croce, Vikash Sehwag, Edgar Dobriban, Nicolas Flammarion, George J. Pappas, Florian
Tramer, Hamed Hassani, and Eric Wong. Jailbreakbench: An open robustness benchmark for
jailbreaking large language models, 2024.
[418] Shaoyang Xu, Weilong Dong, Zishan Guo, Xinwei Wu, and Deyi Xiong. Exploring multilin-
gual human value concepts in large language models: Is value alignment consistent, transfer-
able and controllable across languages?, 2024.
[419] Mantas Mazeika, Long Phan, Xuwang Yin, Andy Zou, Zifan Wang, Norman Mu, Elham
Sakhaee, Nathaniel Li, Steven Basart, Bo Li, et al. Harmbench: A standardized evaluation
framework for automated red teaming and robust refusal. arXiv preprint arXiv:2402.04249,
2024.
[420] Hongyang Yang, Xiao-Yang Liu, and Christina Dan Wang. Fingpt: Open-source financial
large language models. arXiv preprint arXiv:2306.06031, 2023.
[421] Xiao-Yang Liu, Guoxuan Wang, and Daochen Zha. Fingpt: Democratizing internet-scale
data for financial large language models. arXiv preprint arXiv:2307.10485, 2023.
[422] Wei Chen, Qiushi Wang, Zefei Long, Xianyin Zhang, Zhongtian Lu, Bingxuan Li, Siyuan
Wang, Jiarong Xu, Xiang Bai, Xuanjing Huang, and Zhongyu Wei. Disc-finllm: A chi-
nese financial large language model based on multiple experts fine-tuning. arXiv preprint
arXiv:2310.15205, 2023.
[423] Shijie Wu, Ozan Irsoy, Steven Lu, Vadim Dabravolski, Mark Dredze, Sebastian Gehrmann,
Prabhanjan Kambadur, David Rosenberg, and Gideon Mann. Bloomberggpt: A large lan-
guage model for finance. arXiv preprint arXiv:2303.17564, 2023.
60
[424] Yi Yang, Yixuan Tang, and Kar Yan Tam. Investlm: A large language model for investment
using financial domain instruction tuning. arXiv preprint arXiv:2309.13064, 2023.
[425] Yuanhe Tian, Ruyi Gan, Yan Song, Jiaxing Zhang, and Yongdong Zhang. Chimed-gpt: A
chinese medical large language model with full training regime and better alignment to human
preferences. arXiv preprint arXiv:2311.06025, 2023.
[426] Xinlu Zhang, Chenxin Tian, Xianjun Yang, Lichang Chen, Zekun Li, and Linda Ruth Petzold.
Alpacare:instruction-tuned large language models for medical application, 2023.
[427] Ling Luo, Jinzhong Ning, Yingwen Zhao, Zhijun Wang, Zeyuan Ding, Peng Chen, Weiru
Fu, Qinyu Han, Guangtao Xu, Yunzhi Qiu, et al. Taiyi: a bilingual fine-tuned large language
model for diverse biomedical tasks. Journal of the American Medical Informatics Associa-
tion, page ocae037, 2024.
[428] Kailai Yang, Tianlin Zhang, Ziyan Kuang, Qianqian Xie, and Sophia Ananiadou. Mentall-
lama: Interpretable mental health analysis on social media with large language models. arXiv
preprint arXiv:2309.13567, 2023.
[429] June M. Liu, Donghao Li, He Cao, Tianhe Ren, Zeyi Liao, and Jiamin Wu. Chatcounselor:
A large language models for mental health support, 2023.
[430] Hongbo Zhang, Junying Chen, Feng Jiang, Fei Yu, Zhihong Chen, Jianquan Li, Guiming
Chen, Xiangbo Wu, Zhiyi Zhang, Qingying Xiao, Xiang Wan, Benyou Wang, and Haizhou Li.
Huatuogpt, towards taming language models to be a doctor. arXiv preprint arXiv:2305.15075,
2023.
[431] Honglin Xiong, Sheng Wang, Yitao Zhu, Zihao Zhao, Yuxiao Liu, Qian Wang, and Dinggang
Shen. Doctorglm: Fine-tuning your chinese doctor is not a herculean task. arXiv preprint
arXiv:2304.01097, 2023.
[432] Shengbin Yue, Wei Chen, Siyuan Wang, Bingxuan Li, Chenchen Shen, Shujun Liu, Yuxuan
Zhou, Yao Xiao, Song Yun, Xuanjing Huang, and Zhongyu Wei. Disc-lawllm: Fine-tuning
large language models for intelligent legal services, 2023.
[433] Haitao Li, Qingyao Ai, Jia Chen, Qian Dong, Yueyue Wu, Yiqun Liu, Chong Chen, and
Qi Tian. Sailer: Structure-aware pre-trained language model for legal case retrieval, 2023.
[434] Quzhe Huang, Mingxu Tao, Chen Zhang, Zhenwei An, Cong Jiang, Zhibin Chen, Zirui Wu,
and Yansong Feng. Lawyer llama technical report. ArXiv, abs/2305.15062, 2023.
[435] Wanwei He, Jiabao Wen, Lei Zhang, Hao Cheng, Bowen Qin, Yunshui Li, Feng Jiang, Jun-
ying Chen, Benyou Wang, and Min Yang. Hanfei-1.0. https://github.com/siat-nlp/HanFei,
2023.
[436] Jiaxi Cui, Zongjian Li, Yang Yan, Bohua Chen, and Li Yuan.
Chatlaw: Open-source
legal large language model with integrated external knowledge bases.
arXiv preprint
arXiv:2306.16092, 2023.
[437] Yuhao Dan, Zhikai Lei, Yiyang Gu, Yong Li, Jianghao Yin, Jiaju Lin, Linhao Ye, Zhiyan
Tie, Yougen Zhou, Yilei Wang, et al. Educhat: A large-scale language model-based chatbot
system for intelligent education. arXiv preprint arXiv:2308.02773, 2023.
[438] Jingsi Yu, Junhui Zhu, Yujie Wang, Yang Liu, Hongxiang Chang, Jinran Nie, Cunliang Kong,
Ruining Chong, XinLiu, Jiyuan An, Luming Lu, Mingwei Fang, and Lin Zhu. Taoli llama.
https://github.com/blcuicall/taoli, 2023.
[439] Peng Wang, Xiang Wei, Fangxu Hu, and Wenjuan Han. Transgpt: Multi-modal generative
pre-trained transformer for transportation. arXiv preprint arXiv:2402.07233, 2024.
[440] Zeming Chen, Alejandro Hernández Cano, Angelika Romanou, Antoine Bonnet, Kyle Ma-
toba, Francesco Salvi, Matteo Pagliardini, Simin Fan, Andreas Köpf, Amirkeivan Mo-
htashami, et al. Meditron-70b: Scaling medical pretraining for large language models. arXiv
preprint arXiv:2311.16079, 2023.
61
[441] Karan Singhal, Shekoofeh Azizi, Tao Tu, S Sara Mahdavi, Jason Wei, Hyung Won Chung,
Nathan Scales, Ajay Tanwani, Heather Cole-Lewis, Stephen Pfohl, et al. Large language
models encode clinical knowledge. Nature, 620(7972):172–180, 2023.
[442] Guangyu Wang, Guoxing Yang, Zongxin Du, Longjun Fan, and Xiaohu Li. Clinicalgpt: large
language models finetuned with diverse medical data and comprehensive evaluation. arXiv
preprint arXiv:2306.09968, 2023.
[443] Chaoyi Wu, Xiaoman Zhang, Ya Zhang, Yanfeng Wang, and Weidi Xie. Pmc-llama: Further
finetuning llama on medical papers. arXiv preprint arXiv:2304.14454, 2023.
[444] Tianyu Han, Lisa C Adams, Jens-Michalis Papaioannou, Paul Grundmann, Tom Oberhauser,
Alexander Löser, Daniel Truhn, and Keno K Bressem. Medalpaca–an open-source collection
of medical conversational ai models and training data. arXiv preprint arXiv:2304.08247,
2023.
[445] Li Yunxiang, Li Zihan, Zhang Kai, Dan Ruilong, and Zhang You. Chatdoctor: A medical
chat model fine-tuned on llama model using medical domain knowledge.
arXiv preprint
arXiv:2303.14070, 2023.
[446] Junying Chen, Xidong Wang, Anningzhe Gao, Feng Jiang, Shunian Chen, Hongbo Zhang,
Dingjie Song, Wenya Xie, Chuyi Kong, Jianquan Li, et al. Huatuogpt-ii, one-stage training
for medical adaption of llms. arXiv preprint arXiv:2311.09774, 2023.
[447] Alexis Conneau, Kartikay Khandelwal, Naman Goyal, Vishrav Chaudhary, Guillaume Wen-
zek, Francisco Guzmán, Edouard Grave, Myle Ott, Luke Zettlemoyer, and Veselin Stoyanov.
Unsupervised cross-lingual representation learning at scale. In Proceedings of the 58th An-
nual Meeting of the Association for Computational Linguistics. Association for Computa-
tional Linguistics, 2020.
[448] Quzhe Huang, Mingxu Tao, Zhenwei An, Chen Zhang, Cong Jiang, Zhibin Chen, Zirui Wu,
and Yansong Feng. Lawyer llama technical report. arXiv preprint arXiv:2305.15062, 2023.
[449] Pierre Colombo, Telmo Pessoa Pires, Malik Boudiaf, Dominic Culver, Rui Melo, Caio Corro,
Andre FT Martins, Fabrizio Esposito, Vera Lúcia Raposo, Sofia Morgado, et al. Saullm-7b:
A pioneering large language model for law. arXiv preprint arXiv:2403.03883, 2024.
[450] Ilias Chalkidis, Manos Fergadiotis, Prodromos Malakasiotis, Nikolaos Aletras, and Ion An-
droutsopoulos. Legal-bert: The muppets straight out of law school. In Findings of the Asso-
ciation for Computational Linguistics: EMNLP 2020, pages 2898–2904, 2020.
[451] Neha Bansal, Arun Sharma, and RK Singh. A review on the application of deep learning in
legal domain. In Artificial Intelligence Applications and Innovations: 15th IFIP WG 12.5
International Conference, AIAI 2019, Hersonissos, Crete, Greece, May 24–26, 2019, Pro-
ceedings 15, pages 374–381. Springer, 2019.
[452] Thomas F Gordon, Guido Governatori, and Antonino Rotolo. Rules and norms: Require-
ments for rule interchange languages in the legal domain.
In International Workshop on
Rules and Rule Markup Languages for the Semantic Web, pages 282–296. Springer, 2009.
[453] Ha-Thanh Nguyen, Hiroaki Yamada, and Ken Satoh. Gpts and language barrier: A cross-
lingual legal qa examination. arXiv preprint arXiv:2403.18098, 2024.
[454] Juliano Rabelo, Mi-Young Kim, Randy Goebel, Masaharu Yoshioka, Yoshinobu Kano, and
Ken Satoh. A summary of the coliee 2019 competition. In New Frontiers in Artificial Intelli-
gence: JSAI-isAI International Workshops, JURISIN, AI-Biz, LENLS, Kansei-AI, Yokohama,
Japan, November 10–12, 2019, Revised Selected Papers 10, pages 34–49. Springer, 2020.
[455] Juliano Rabelo, Randy Goebel, Mi-Young Kim, Yoshinobu Kano, Masaharu Yoshioka, and
Ken Satoh. Overview and discussion of the competition on legal information extraction/en-
tailment (coliee) 2021. The Review of Socionetwork Strategies, 16(1):111–133, 2022.
62
[456] Ilias Chalkidis, Abhik Jana, Dirk Hartung, Michael Bommarito, Ion Androutsopoulos, Daniel
Katz, and Nikolaos Aletras. Lexglue: A benchmark dataset for legal language understanding
in english. In Proceedings of the 60th Annual Meeting of the Association for Computational
Linguistics (Volume 1: Long Papers), pages 4310–4330, 2022.
[457] Gabriel Nicholas and Aliya Bhatia. Lost in translation: Large language models in non-english
content analysis. arXiv preprint arXiv:2306.07377, 2023.
[458] Asya Pereltsvaig. Languages of the World. Cambridge University Press, 2020.
[459] Edgar W Schneider. English and colonialism. In The Routledge handbook of English lan-
guage studies, pages 42–58. Routledge, 2018.
[460] Alastair Pennycook. English and the discourses of colonialism. Routledge, 2002.
[461] Pratik Joshi, Sebastin Santy, Amar Budhiraja, Kalika Bali, and Monojit Choudhury. The
state and fate of linguistic diversity and inclusion in the NLP world.
In Dan Jurafsky,
Joyce Chai, Natalie Schluter, and Joel Tetreault, editors, Proceedings of the 58th Annual
Meeting of the Association for Computational Linguistics, pages 6282–6293, Online, July
2020. Association for Computational Linguistics. doi: 10.18653/v1/2020.acl-main.560. URL
https://aclanthology.org/2020.acl-main.560.
[462] Jesse Dodge, Maarten Sap, Ana Marasovi´c, William Agnew, Gabriel Ilharco, Dirk Groen-
eveld, Margaret Mitchell, and Matt Gardner. Documenting large webtext corpora: A case
study on the colossal clean crawled corpus. In Proceedings of the 2021 Conference on Em-
pirical Methods in Natural Language Processing, pages 1286–1305, 2021.
[463] Isaac Caswell, Theresa Breiner, Daan van Esch, and Ankur Bapna. Language ID in the wild:
Unexpected challenges on the path to a thousand-language web text corpus. In Donia Scott,
Nuria Bel, and Chengqing Zong, editors, Proceedings of the 28th International Conference
on Computational Linguistics, pages 6588–6608, Barcelona, Spain (Online), December 2020.
International Committee on Computational Linguistics. doi: 10.18653/v1/2020.coling-main.
579. URL https://aclanthology.org/2020.coling-main.579.
[464] Julia Kreutzer, Isaac Caswell, Lisa Wang, Ahsan Wahab, Daan van Esch, Nasanbayar Ulzii-
Orshikh, Allahsera Tapo, Nishant Subramani, Artem Sokolov, Claytone Sikasote, et al. Qual-
ity at a glance: An audit of web-crawled multilingual datasets. Transactions of the Association
for Computational Linguistics, 10:50–72, 2022.
[465] Wilhelmina Nekoto, Vukosi Marivate, Tshinondiwa Matsila, Timi Fasubaa, Taiwo Fagbo-
hungbe, Solomon Oluwole Akinola, Shamsuddeen Muhammad, Salomon Kabongo Kabena-
mualu, Salomey Osei, Freshia Sackey, Rubungo Andre Niyongabo, Ricky Macharm, Perez
Ogayo, Orevaoghene Ahia, Musie Meressa Berhe, Mofetoluwa Adeyemi, Masabata Mokgesi-
Selinga, Lawrence Okegbemi, Laura Martinus, Kolawole Tajudeen, Kevin Degila, Kelechi
Ogueji, Kathleen Siminyu, Julia Kreutzer, Jason Webster, Jamiil Toure Ali, Jade Abbott, Iroro
Orife, Ignatius Ezeani, Idris Abdulkadir Dangana, Herman Kamper, Hady Elsahar, Goodness
Duru, Ghollah Kioko, Murhabazi Espoir, Elan van Biljon, Daniel Whitenack, Christopher
Onyefuluchi, Chris Chinenye Emezue, Bonaventure F. P. Dossou, Blessing Sibanda, Blessing
Bassey, Ayodele Olabiyi, Arshath Ramkilowan, Alp Öktem, Adewale Akinfaderin, and Ab-
dallah Bashir. Participatory research for low-resourced machine translation: A case study in
African languages. In Trevor Cohn, Yulan He, and Yang Liu, editors, Findings of the Asso-
ciation for Computational Linguistics: EMNLP 2020, pages 2144–2160, Online, November
2020. Association for Computational Linguistics. doi: 10.18653/v1/2020.findings-emnlp.
195. URL https://aclanthology.org/2020.findings-emnlp.195.
[466] Ewa S Callahan and Susan C Herring. Cultural bias in wikipedia content on famous persons.
Journal of the American society for information science and technology, 62(10):1899–1915,
2011.
[467] Charith Peris, Christophe Dupuy, Jimit Majmudar, Rahil Parikh, Sami Smaili, Richard Zemel,
and Rahul Gupta. Privacy in the time of language models. In Proceedings of the Sixteenth
ACM International Conference on Web Search and Data Mining, pages 1291–1292, 2023.
63
[468] Yifan Yao, Jinhao Duan, Kaidi Xu, Yuanfang Cai, Zhibo Sun, and Yue Zhang. A survey on
large language model (llm) security and privacy: The good, the bad, and the ugly. High-
Confidence Computing, page 100211, 2024.
[469] Biwei Yan, Kun Li, Minghui Xu, Yueyan Dong, Yue Zhang, Zhaochun Ren, and Xiuzheng
Cheng. On protecting the data privacy of large language models (llms): A survey. arXiv
preprint arXiv:2403.05156, 2024.
[470] Nikhil Kandpal, Eric Wallace, and Colin Raffel. Deduplicating training data mitigates privacy
risks in language models. In International Conference on Machine Learning, pages 10697–
10707. PMLR, 2022.
[471] Nandan Thakur, Suleman Kazi, Ge Luo, Jimmy Lin, and Amin Ahmad. Mirage-bench: Auto-
matic multilingual benchmark arena for retrieval-augmented generation systems, 2024. URL
https://arxiv.org/abs/2410.13716.
[472] Uma Roy, Noah Constant, Rami Al-Rfou, Aditya Barua, Aaron Phillips, and Yinfei Yang.
LAReQA: Language-agnostic answer retrieval from a multilingual pool. In Bonnie Web-
ber, Trevor Cohn, Yulan He, and Yang Liu, editors, Proceedings of the 2020 Conference
on Empirical Methods in Natural Language Processing (EMNLP), pages 5919–5930, On-
line, November 2020. Association for Computational Linguistics. doi: 10.18653/v1/2020.
emnlp-main.477. URL https://aclanthology.org/2020.emnlp-main.477.
[473] Yupeng Chang, Xu Wang, Jindong Wang, Yuan Wu, Linyi Yang, Kaijie Zhu, Hao Chen,
Xiaoyuan Yi, Cunxiang Wang, Yidong Wang, et al. A survey on evaluation of large language
models. ACM Transactions on Intelligent Systems and Technology, 15(3):1–45, 2024.
[474] Guilherme Penedo, Hynek Kydlíˇcek, Leandro von Werra, and Thomas Wolf. Fineweb, 2024.
URL https://huggingface.co/datasets/HuggingFaceFW/fineweb.
[475] Leo Gao, Stella Biderman, Sid Black, Laurence Golding, Travis Hoppe, Charles Foster, Jason
Phang, Horace He, Anish Thite, Noa Nabeshima, et al. The pile: An 800gb dataset of diverse
text for language modeling. arXiv preprint arXiv:2101.00027, 2020.
[476] Luca Soldaini, Rodney Kinney, Akshita Bhagia, Dustin Schwenk, David Atkinson, Rus-
sell Authur, Ben Bogin, Khyathi Chandu, Jennifer Dumas, Yanai Elazar, et al. Dolma: An
open corpus of three trillion tokens for language model pretraining research. arXiv preprint
arXiv:2402.00159, 2024.
[477] Xiang Zhang, Senyu Li, Bradley Hauer, Ning Shi, and Grzegorz Kondrak. Don’t trust chatgpt
when your question is not in english: A study of multilingual abilities and types of llms. In
Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing,
pages 7915–7927, 2023.
[478] Wenxuan Zhang, Mahani Aljunied, Chang Gao, Yew Ken Chia, and Lidong Bing. M3exam:
A multilingual, multimodal, multilevel benchmark for examining large language models. Ad-
vances in Neural Information Processing Systems, 36, 2024.
[479] Emilio Ferrara. Should chatgpt be biased? challenges and risks of bias in large language
models. arXiv preprint arXiv:2304.03738, 2023.
[480] Jialu Wang, Yang Liu, and Xin Eric Wang. Assessing multilingual fairness in pre-trained mul-
timodal representations. In Proceedings of Annual Meeting of Association for Computational
Linguistics, 2022.
[481] Sharon Levy, Neha John, Ling Liu, Yogarshi Vyas, Jie Ma, Yoshinari Fujinuma, Miguel
Ballesteros, Vittorio Castelli, and Dan Roth. Comparing biases and the impact of multilingual
training across multiple languages. In Proceedings of the 2023 Conference on Empirical
Methods in Natural Language Processing, pages 10260–10280, 2023.
[482] Kai-Ching Yeh, Jou-An Chi, Da-Chen Lian, and Shu-Kai Hsieh. Evaluating interfaced llm
bias. In Proceedings of the 35th Conference on Computational Linguistics and Speech Pro-
cessing (ROCLING 2023), pages 292–299, 2023.
64
[483] Ben Hutchinson, Vinodkumar Prabhakaran, Emily Denton, Kellie Webster, Yu Zhong, and
Stephen Denuyl. Social biases in nlp models as barriers for persons with disabilities. In
Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics,
pages 5491–5501, 2020.
[484] Moin Nadeem, Anna Bethke, and Siva Reddy. Stereoset: Measuring stereotypical bias in
pretrained language models. In Proceedings of the 59th Annual Meeting of the Association for
Computational Linguistics and the 11th International Joint Conference on Natural Language
Processing (Volume 1: Long Papers), pages 5356–5371, 2021.
[485] Yixin Wan, George Pu, Jiao Sun, Aparna Garimella, Kai-Wei Chang, and Nanyun Peng.
“kelly is a warm person, joseph is a role model”: Gender biases in llm-generated reference
letters. In Findings of the Association for Computational Linguistics: EMNLP 2023, pages
3730–3748, 2023.
[486] Adrian de Wynter, Ishaan Watts, Nektar Ege Altıntoprak, Tua Wongsangaroonsri, Minghui
Zhang, Noura Farra, Lena Baur, Samantha Claudet, Pavel Gajdusek, Can Gören, et al. Rtp-lx:
Can llms evaluate toxicity in multilingual scenarios? arXiv preprint arXiv:2404.14397, 2024.
[487] Jeongrok Yu, Seong Ug Kim, Jacob Choi, and Jinho D Choi. What is your favorite gen-
der, mlm? gender bias evaluation in multilingual masked language models. arXiv preprint
arXiv:2404.06621, 2024.
[488] Jieyu Zhao, Subhabrata Mukherjee, Saghar Hosseini, Kai-Wei Chang, and Ahmed Hassan
Awadallah. Gender bias in multilingual embeddings and cross-lingual transfer. In Proceed-
ings of the 58th Annual Meeting of the Association for Computational Linguistics, pages
2896–2907, 2020.
[489] Laura Cabello Piqueras and Anders Søgaard. Are pretrained multilingual models equally fair
across languages?
In Proceedings of the 29th International Conference on Computational
Linguistics, pages 3597–3605, 2022.
[490] Aniket Vashishtha, Kabir Ahuja, and Sunayana Sitaram. On evaluating and mitigating gender
biases in multilingual settings. arXiv preprint arXiv:2307.01503, 2023.
[491] Gemma Team, Thomas Mesnard, Cassidy Hardin, Robert Dadashi, Surya Bhupatiraju, Shreya
Pathak, Laurent Sifre, Morgane Rivière, Mihir Sanjay Kale, Juliette Love, et al. Gemma:
Open models based on gemini research and technology. arXiv preprint arXiv:2403.08295,
2024.
[492] Manon Reusens, Philipp Borchert, Margot Mieskes, Jochen De Weerdt, and Bart Baesens.
Investigating bias in multilingual language models: Cross-lingual transfer of debiasing tech-
niques. In Proceedings of the 2023 Conference on Empirical Methods in Natural Language
Processing, pages 2887–2896, 2023.
[493] Shrimai Prabhumoye, Yulia Tsvetkov, Ruslan Salakhutdinov, and Alan W Black. Style trans-
fer through back-translation. In Proceedings of the 56th Annual Meeting of the Association
for Computational Linguistics (Volume 1: Long Papers), pages 866–876, 2018.
[494] Vu Cong Duy Hoang, Philipp Koehn, Gholamreza Haffari, and Trevor Cohn. Iterative back-
translation for neural machine translation. In Proceedings of the 2nd Workshop on Neural
Machine Translation and Generation, pages 18–24, 2018.
[495] Richard W Brislin. Back-translation for cross-cultural research. Journal of cross-cultural
psychology, 1:185–216, 1970.
65
