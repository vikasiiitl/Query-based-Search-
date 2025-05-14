Springer Nature 2021 LATEX template
Taxi1500: A Multilingual Dataset for Text
Classification in 1500 Languages
Chunlan Ma1,2*, Ayyoob Imani1,2, Haotian Ye1,2, Renhao
Pei1, Ehsaneddin Asgari3 and Hinrich Sch¨utze1,2
1CIS, LMU Munich, Germany.
2Munich Center for Machine Learning (MCML).
3University of California, Berkeley, USA.
*Corresponding author(s). E-mail(s): machunlan@cis.lmu.de;
Contributing authors: ayyoob@cis.lmu.de; yehao@cis.lmu.de;
R.Pei@campus.lmu.de; asgari@berkeley.edu; inquiries@cislmu.org;
Abstract
While natural language processing tools have been developed extensively
for some of the world’s languages, a significant portion of the world’s over
7000 languages are still neglected. One reason for this is that evaluation
datasets do not yet cover a wide range of languages, including low-
resource and endangered ones. We aim to address this issue by creating
a text classification dataset encompassing a large number of languages,
many of which currently have little to no annotated data available. We
leverage parallel translations of the Bible to construct such a dataset by
first developing applicable topics and employing a crowdsourcing tool
to collect annotated data. By annotating the English side of the data
and projecting the labels onto other languages through aligned verses,
we generate text classification datasets for more than 1500 languages.
We extensively benchmark several existing multilingual language models
using our dataset. To facilitate the advancement of research in this area,
we release 670 language in 1430 editions at the time of publishing. Our
dataset and code are available at: https://github.com/cisnlp/Taxi1500.
Keywords: Multilingual, Low-Resource, Dataset, Classification
1
arXiv:2305.08487v2  [cs.CL]  4 Jun 2024
Springer Nature 2021 LATEX template
2
Article Title
1 Introduction
Language inequality is a real issue in the world today as minority languages are
under-represented and often excluded from language technologies (Joshi et al,
2020). The lack of technological support for minority languages in communi-
ties around the globe has a significant impact on the experience of their users
and is commonly a cause for virtual barriers such as the digital divide.1 Recent
development in language technologies has brought about a surge of multilin-
gual pre-trained language models (MPLMs), such as the multilingual BERT
(mBERT) (Devlin et al, 2018), XLM-R (Conneau et al, 2020), and the more
recently proposed SERENGETI (Adebara et al, 2022) and Glot500-m (Imani-
Googhari et al, 2023), both of which support around 500 languages. While the
number of supported languages in the newest MPLMs keeps increasing, we
are still unable to quantify the performance on most low-resource languages.
We believe that a major cause for why many low-resource languages are still
neglected lies in the lack of evaluation datasets for such languages. For exam-
ple, MPLMs like mBERT and XLM-R are evaluated for many fewer languages
than they are pretrained for because of the limited availability of languages in
most benchmark datasets.
Most existing multilingual benchmarks, such as XNLI (Lewis et al, 2020)
and MLQA (Eisenschlos et al, 2019), rely on translating monolingual bench-
marks, as opposed to collecting data from scratch. This approach involves the
translation of monolingual data either through machine translation or with
the assistance of human professionals. However, machine translation has lim-
itations in terms of the number of languages that can be effectively handled,
which depends on the supported languages of the machine translation system,
while the quality of translations is also not guaranteed. On the other hand,
human translation yields high-quality results but is accompanied by significant
costs.
As a solution, we propose a dataset that covers more than 1500 languages.
We use translations of the Bible as our source and develop classification topics
(i.e., classes) that are general enough so as to apply to many verses and are
at the same time not overly abstract. We obtain annotations for the English
verses using crowdsourcing. Because the Bible is aligned at the verse level, we
can easily project annotations from the English side to all other languages. We
attempt to ensure the quality of our annotated data, including by measuring
inter-annotator agreement. We name our dataset Taxi1500. As a case study,
we evaluate three MPLMs (mBERT, XLM-R and Glot500-m) on Taxi1500.
Our results suggest that Taxi1500 successfully demonstrates the multilingual
generalizability of different MPLMs.
1labs.theguardian.com/digital-language-divide
Springer Nature 2021 LATEX template
Article Title
3
2 Related Works
2.1 Multilingual datasets
To date, most datasets that can be used for multilingual task evaluation (Pan
et al, 2017; Eisenschlos et al, 2019; De Marneffe et al, 2021) contain no more
than a few hundred languages, a small number compared to the world’s 7000
languages. In this section, we give an overview of existing state-of-the-art
multilingual datasets.
The Universal Dependencies Treebanks
Universal Dependencies (UD) v22 is an evergrowing multilingual treebank col-
lection, covering 90 languages and 17 tags. UD collects data from an evolution
of (universal) Stanford dependencies (De Marneffe et al, 2014), Google uni-
versal part-of-speech tags (Petrov et al, 2012), and the Interset interlingua for
morphosyntactic tagsets (Rosen, 2010). UD is often used as a POS tagging
component (representing structured prediction) in multilingual benchmarks
such as XTREME (Hu et al, 2020).
Wikiann
Pan et al (2017) develop a cross-lingual named entity tagging dataset in 282
languages based on articles from Wikipedia. The framework extracts name
tags through cross-lingual and anchor links, self-training, and data selection
methods and links them to an English Wikipedia Knowledge Base. Wikiann is
recently used for the structured named entity prediction task for multilingual
benchmarks such as XTREME (Hu et al, 2020).
Tatoeba
Tatoeba 3 is a community-supported collection of English sentences and trans-
lations into more than 300 languages. The number of translations updates
every Saturday. Artetxe and Schwenk (2019) extract a dataset from Tatoeba
with 1000 sentences in 112 languages. Multilingual benchmark XTREME (Hu
et al, 2020) collects this dataset as a task by calculating the cosine similarity
to evaluate the performance of multilingual models.
MLDoc
Multilingual Document Classification (Lewis et al, 2020) is a multilingual
benchmark for document classification for eight languages: English, French,
Spanish, Italian, German, Russian, Chinese, and Japanese. It uses data from
the Reuters Corpus Volume 2 (RCV2) (Lewis et al, 2004)4, a multilingual cor-
pus with 487,000 news stories in thirteen languages (Dutch, French, German,
2https://lindat.mff.cuni.cz/repository/xmlui/handle/11234/1-3687
3https://tatoeba.org/eng/
4https://trec.nist.gov/data/reuters/reuters.html
Springer Nature 2021 LATEX template
4
Article Title
Dataset
Languages
Tasks
PAWS-X
6
Sentence-pair Classification
MLQA
7
Question Answering
MLDoc
8
Document Classification
XQuAD
10
Question Answering
XLIN
15
Sentence-pair Classification
XTREME*
40
MLQA, XQuAD, PAWS-X, XLIN, NER, POS
The Universal Dependency
90
POS
Wikiann
258
NER
Tatoeba
300
Machine Translation
Table 1 Multilingual datasets and contained tasks. *XTREME contains the task from
MLQA, XQuAD, PAWS-X, XLIN, and two additional tasks NER and POS.
Chinese, Japanese, Russian, Portuguese, Spanish, Latin American Spanish,
Italian, Danish, Norwegian, and Swedish) that are manually classified into four
groups: CCAT (Corporate/Industrial), ECAT (Economics), GCAT (Govern-
ment/Social) and MCAT (Markets). MLDoc samples data with equal class
priors to address the issue of data imbalance that previous research on RCV2
encountered. For example, Klementiev et al (2012) define a subset of English
and German portions from RCV2, which is used in several follow-up works, for
instance, Mogadala and Rettinger (2016) extend the use of RCV2 to French
and Spanish through transfer from English. These above-mentioned corpora
obtain high accuracy during training but far lower accuracy during testing,
which may be caused by the imbalanced distribution of each category. Thus,
Schwenk and Li (2018) sample the same number of examples for each class
and language from RCV2 instead of choosing a random subset to avoid an
imbalanced dataset. The task of MLDoc is the same as RCV2, but with
a balanced evaluation, the balanced dataset enables fair evaluation between
different language models.
XNLI
The Cross-lingual Natural Language Inference Corpus(XNLI) (Eisenschlos
et al, 2019) is a multilingual evaluation benchmark that extends NLI to 15 lan-
guages, namely English, French, Spanish, German, Greek, Bulgarian, Russian,
Turkish, Arabic, Vietnamese, Thai, Chinese, Hindi, and two lower-resource
languages Swahili and Urdu. XNLI supports the evaluation of the NLI task:
two sentences are classified as entailment, contradiction, or neither. XNLI
comprises a total of 112,500 annotated sentence pairs and follows the same
data collection procedure as the MultiNLI corpus (Williams et al, 2018): 250
sentences are sampled from ten sources of the Open American National Cor-
pus: Face-To-Face, Telephone, Government, 9/11, Letters, Oxford University
Press (OUP), Slate, Verbatim, and Government, and the fiction novel Captain
Blood. These sentences are then translated into the other 14 languages using
the One Hour Translation crowdsourcing platform. This approach enables lan-
guage models to learn cross-lingual inference ability by using pairs of premise
and hypothese in different languages.
Springer Nature 2021 LATEX template
Article Title
5
MLQA
MLQA (Lewis et al, 2020) is a series of multilingual extractive question-
answering corpora available in seven languages: English, Arabic, German,
Vietnamese, Spanish, Simplified Chinese, and Hindi. The resulting corpora
have over 12K instances in English and 5K in each other language, with
an average of four parallel sentences across languages per instance (Con-
neau et al, 2020). The extraction process involves identifying paragraphs from
Wikipedia articles that cover the same or similar topics in multiple lan-
guages. Subsequently, crowdsourcing is used to generate questions and answer
spans from English paragraphs via the Amazon Mechanical Turk platform.
The researchers employ professional translators to translate English questions
into the target languages, and the translators then annotate answer spans
within the corresponding paragraphs. MLQA leverages Wikipedia articles as
the source due to Wikipedia’s naturally parallel nature and large scale.
XQuAD
XQuAD (Cross-lingual Question Answering Dataset) (Artetxe et al, 2019) is
a multilingual benchmark dataset for cross-lingual question answering tasks.
It involves the translation of 240 paragraphs and 1,190 question-answer pairs
from the development subset of SQuAD v1.1 (Rajpurkar et al, 2016) into
ten languages, namely Spanish, German, Greek, Russian, Turkish, Arabic,
Vietnamese, Thai, Chinese, and Hindi. Instead of collecting data from scratch,
XQuAD translates data from SQuAD to avoid unanswerable questions. The
researchers constructed XQuAD to mitigate the issue of superficial keyword
matching problems that can arise in cross-lingual question answering tasks.
The dataset is evaluated using both CLWE (Rajpurkar et al, 2016) and a
monolingual model.
XTREME
The Cross-lingual TRansfer Evaluation of Multilingual Encoders (XTREME)
benchmark(Hu et al, 2020) is a massively compiled multilingual benchmark
compromising 40 languages and 9 tasks. As a state-of-the-art multilingual
benchmark, XTREME is designed based on available multilingual corpora and
their variable tasks. The nine tasks are categorized into different categories,
namely classification, structured prediction, Question-Answering, and Infor-
mation Retrieval (shown in table 2.1). To obtain labeled data, the authors
utilized corpora such as XNLI, PAWS-X, Universal Dependencies v2.5 (English
for training and target language test set for evaluation) and Wikiann (data
selection).
2.2 Multilingual language models
Multilingual models are large language models that cover several different
languages. For instance, mBERT and XLM-R are pre-trained on over 100
Springer Nature 2021 LATEX template
6
Article Title
languages. In this section, we discuss the four models that are relevant to our
Taxi1500 evaluation case study.
mBERT
mBERT (Multilingual Bidirectional Encoder Representations from Transform-
ers) (Devlin et al, 2018) is the multilingual variant of BERT, which follows the
BERT recipe closely. Similar to BERT, mBERT uses the encoder architecture
from Transformer, with Masked Language Modeling (MLM) and Next Sen-
tence Prediction (NSP) as its training objectives. mBERT differs from BERT
primarily in its training data. While BERT is trained on English Wikipedia
and the Toronto Books Corpus, mBERT has a training set from Wikipedia in
104 languages, with an uncased version (102 languages) and a cased version
(104 languages). Both versions have the same hyper-parameters: 12 layers, 768
hidden units per layer, 12 attention heads, a 110k shared WordPiece vocab-
ulary, and 110M parameters5. Normally, the cased version is recommended
because it fixes normalization issues in many languages.
XLM
XLM (Cross-Lingual Models) (Lample and Conneau, 2019) is also a BERT-
based model and acquires multilingual ability by using improved pre-training
methods. XLM uses three objectives, two of which are unsupervised and
merely require monolingual data. The two unsupervised tasks, Causal Lan-
guage Modeling (CLM) and Masked Language Modeling (MLM) aim to learn
cross-lingual representations. The supervised objective Translation Language
Modeling (TLM) relies on parallel corpora. TLM extends MLM from BERT
and replaces monolingual sentence pairs with parallel multilingual sentence
pairs. A sentence pair is concatenated from a source language sentence and
a target language sentence. The words in the source and target sentence are
randomly masked. To predict the masked words, the model is allowed to
attend to the source language sentence or the target language sentence, which
enables the model to align the source and target sentence. Therefore, the model
obtains cross-lingual ability with TLM modeling. As for the training data,
XLM crawls Wikipedia dumps as monolingual data for CLM and MLM objec-
tives. For TLM, the authors only use parallel data containing English from
different resources such as MultiUN (Ziemski et al, 2016), IIT Bombay cor-
pus (Kunchukuttan et al, 2018) and EUbookshop corpus. For the embeddings,
fastBPE is applied to split words into subword units. The authors release mul-
tiple pre-trained versions of XLM, the most massively-multilingual variant is
XLM-R (Conneau et al, 2020).
XLM-R
XLM-R (Conneau et al, 2020) is an improved version of XLM. Inspired by
RoBERTa (Liu et al, 2019). The authors claim that mBERT and XLM are
5https://github.com/google-research/bert/blob
Springer Nature 2021 LATEX template
Article Title
7
both undertrained. Therefore, they pre-train XLM-R with larger model size
and massive data from Common Crawl in 104 languages, significantly boosting
the performance and outperforming mBERT. Compared with XLM, XLM-R
has a larger vocabulary size of 250K. Besides, the training data scales from
Wikipedia to a larger Common Crawl corpus. The authors provide two XLM-R
versions, XLM-R Base (12 layers, 768 hidden units, 12 attention heads, 270M
parameters) and XLM-R Large (24 layers, 1024 hidden units, 16 attention
heads, 550M parameters). XLM-R mitigates the curse of multilinguality (i.e.,
it addresses the increased need for parameters when the number of covered
languages increases) by increasing the model capacity.
Glot500-m
Utilizing continuous pretraining based on XLM-R, Glot500-m(ImaniGooghari
et al, 2023) was developed as a multilingual LLM on 500 languages. To train the
model, the authors collect and clean a corpus, Glot500c, that covers more than
500 languages. Glot500m is evaluated on six tasks, namely sentence retrieval
Tatoeba, sentence retrieval Bible, Taxi1500, text classification, NER, POS and
round-trip alignment. The authors illustrate results with two language sets:
head languages (104 pretrained languages of XLM-R) and tail languages (the
remaining languages) and compare results with XLM-R-Base and XLM-R-
Large. They find that multilingual LLMs’ quality is not only influenced by a
single isssue, but is determined by several factors, including corpus, script and
related languages.
SERENGETI
SERENGETI (Adebara et al, 2022) is pretrained with 517 African languages
and the 10 most spoken languages in the world. It is an Electra (Clark et al,
2020) style model. To obtain the training data, the authors collect a multi-
domain multi-script corpus manually. The corpus includes religious domain,
news domain, government documents, health documents and some data from
existing corpora. SERENGETI is evaluated on seven task clusters, containing
NER, POS, phrase chunking, news classification, sentiment classification and
topic classification and the results are provided as AfroNLU benchmark. Their
evaluation indicates that SERENGETI outperforms XLM-R (Conneau et al,
2020), KinyarBERT (Nzeyimana and Rubungo, 2022), AfriBERTA (Ogueji
et al, 2021) and Afro-XLMR (Alabi et al, 2022) on 11 datasets with 82.27
average F1.
2.3 The Parallel Bible Dataset
In current NLP research, parallel corpora play a crucial role as they serve
as cross-lingual bridges, enabling the processing and understanding of less
known languages through other languages. In this study, we employ transla-
tions of the Bible as the source of parallel data, utilizing both the Parallel
Bible Corpus (Mayer and Cysouw, 2014), covering 1304 languages, as well as
Springer Nature 2021 LATEX template
8
Article Title
01001001
In the beginning God created the heavens and the earth .
01001001
Im Anfang erschuf Gott die Himmel und die Erde .
01001001
Au commencement Dieu cr´ea les cieux et la terre .
additional translations collected from the web, resulting in total coverage of
1500+ languages. While there are other resources for parallel data available,
such as Europarl (Koehn, 2005), JW300 (Agi´c and Vuli´c, 2019), and OPUS
(Tiedemann, 2012), we have chosen to use translations of the Bible due to the
relatively larger number of supported languages.
2.3.1 PBC
PBC consists of three main parts, namely the .txt files of actual Bible texts,
the .wordforms files that alphabetically list all word forms in the texts, and the
.mtx files (word-by-verse matrices). Our work only uses the .txt files. Every
text file is one language version of the Bible. Below we include several examples
to illustrate the inner structure of the text file: every line contains an ID and
the respective verse which is tokenized. The verse IDs are identical in different
languages. When we use the parallel dataset, we can find the same verse in
other languages with the help of the verse ID.
2.3.2 1000Langs
The 1000Langs corpus contains the crawled data of 1500+ unique languages,
which are sourced from multiple Bible websites. The two main websites are
https://png.bible and https://ebible.org.
3 Dataset Creation
3.1 Principles of task design
In designing and creating Taxi1500, we exploit the nature of PBC (i.e., the fact
that it is a parallel corpus), but are at the same time limited by some of its
specifics. In particular, we were guided by two considerations: cost efficiency
and influence of the domain of the Bible (i.e., religious text).
Cost efficiency.
In order to lower the cost, we exclude tasks that require
the hiring of target language experts for annotation. Given that the PBC is
sentence-aligned, these include tasks such as NER and POS tagging, which are
based on word units. We also exclude tasks such as question answering, which
require data generation on the side of target language experts. Therefore, the
sentence classification task is chosen as our task to utilize the PBC without
knowledge of other languages. As the PBC is a parallel text that is sentence
aligned, we can easily obtain the label of verses in other languages, as long as
we obtain annotations of English verses.
Springer Nature 2021 LATEX template
Article Title
9
Bible domain.
There are many kinds of classification tasks. We exclude
sentiment and emotion classification because many verses are objective descrip-
tions of a state or event. In the end, we select topic classification as the a
classification task for Taxi1500 because it can be naturally applied to the Bible.
3.2 Data annotation
We describe our data annotation procedure in detail. Since many low-resource
languages only have a translated New Testament, we use verses from the New
Testament to build our dataset. In the first round of annotation, three anno-
tators develop a few possible topics for a subset of the New Testament verses
and decide on six final topics after discussion: recommendation, faith, descrip-
tion, sin, grace, and violence (see table 2). We select verses for which at least
two of the three annotators agree. We then remove verses that receive multiple
topic assignments and those that receive none. The motivation is that remov-
ing ambiguous verses makes the annotation task easier for annotators (which
also reduces the annotation cost). We submit the remaining 1077 verses to
Amazon MTurk6, a crowdsourcing platform, for annotation and specify the
US as the annotators’ location. Each verse is eventually annotated ten times
in total. The final labels are selected by majority voting. In the case of a tie,
the final label is randomly selected from the majority labels.
Issues of annotation quality may arise if 1) the task is confusing, and 2) the
worker does not annotate carefully. To lessen the effects of the first problem,
we provide detailed guidelines and examples to the annotators. Annotators are
required to pass a qualification test which is given prior to each annotation
batch, making sure they understand the task fully. Additionally, we implement
quality control in the form of a performance threshold. Specifically, we con-
struct “pseudo gold standard” data, i.e., labels derived from the majority vote
among all annotators, and compare them with the annotations of each worker.
The annotations of a worker are rejected and the verses are republished for a
new round of annotation if the worker obtains an F1 of < .4.
We use Krippendorff’s α (K-α) to compute inter-annotator agreement. K-
α is chosen because it can handle missing annotations in the dataset since each
worker only annotates a subset of the verses. Table 3 shows K-α values for
different thresholds, i.e., the minimum votes for the majority label required
for a verse to be accepted. We obtain K-α = .44 on the entire dataset, which
can be improved by raising the threshold of required votes. But as Figure 1
demonstrates, there is a clear tradeoff between the number of accepted verses
and K-α, and improving K-α would reduce the size of the dataset. Furthermore,
a slightly suboptimal K-α value is not surprising considering that the topics
of our task are subjective, and as (Price et al, 2020) points out, a low K-
α does not necessarily signify low data quality. We thus do not remove any
data by raising the required number of votes and rely on the control measures
described above to ensure data quality.
6www.mturk.com
Springer Nature 2021 LATEX template
10
Article Title
class
definition
Recommendation
An imperative statement which suggests to act
or believe in certain ways.
Faith
Display of belief and love toward God,
instructions on how to maintain faith, stories
of faith and its consequences, etc.
Description
Describes a person, relationship, phenomenon,
situation, etc.
Sin
Describes what is considered sin, stories of
sinful people and sinful actions.
Grace
God’s love, blessing, and kindness towards
humans.
Violence
Describes wars, conflict, threats, and
torture; but also destructions of people,
cities, and nations.
Table 2
Definitions of the six Taxi1500 classes
vote ≥
3
4
5
6
7
8
9
num. verses 1077 1055
941
755
563
388
233
K-α
0.44
0.44 0.48 0.55 0.63 0.73 0.83
Table 3
The K-α value increases as we specify a higher threshold for the minimum
number of votes of the majority topic. 3 is the lowest value here since we do not have any
verses where the majority label has < 3 votes.
0.5
0.6
0.7
0.8
200
400
600
800
1,000
K-α
num. verses
Fig. 1
Tradeoff between K-α and the number of verses. Each dot in the plot stands for a
threshold of the required minimum votes ∈{3, 4, 5, 6, 7, 8, 9} for a verse to be accepted.
4 The Dataset
The final Taxi1500 dataset consists of 1077 verses categorized into six topics:
faith, grace, sin, violence, description, and recommendation. Table 4 shows an
overview of the topics with one example for each, as well as the number of
verses of each topic in the English dataset. Violence, with 59 instances, is the
smallest class and recommendation, with 281, is the largest. Since some lan-
guages have incomplete translations of the New Testament and do not contain
Springer Nature 2021 LATEX template
Article Title
11
Fig. 2 Confusion matrices of five-fold cross validation of XLM-R-Base and Glot500.
all of the 1077 verses, we exclude languages where the total number of anno-
tated verses is less than 900. This leaves us with 1504 languages from 113
language families which are spread across the globe7. The dataset obtained for
each of the 1504 languages is split into train, development, and test sets with
a ratio of 80/10/10, with 860, 106, and 111 verses respectively8.
class
example
num. verses
recommendation If you love me , you will observe my
commandments
281
faith
Most truly I say to you , whoever believes
has everlasting life
260
description
There was a man of the Pharisees named
Nicodemus , a ruler of the Jews
184
sin
That is why I said to you : You will die
in your sins . For if you do not believe
that I am the one , you will die in your
sins .
153
grace
The Father loves the Son and has given all
things into his hand
140
violence
He put James the brother of John to death
by the sword
59
Table 4
The table gives an example verse and the total number of verses in the
crowdsourced English dataset for each class.
To show more details of Taxi1500’s topics, we present confusion matrices of
five-fold cross-validation of XLM-R-Base and Glot500 in Figure 2. The matri-
ces show that the topics Sin and Grace tend to be classified more frequently as
other topics. This indicates that verses in Sin and Grace are more ambiguous
to the models.
7family and geographical data from glottolog.org
8development and test sets have different sizes, because we split off train and development
verses using their respective ratios and treat the rest as test verses
Springer Nature 2021 LATEX template
12
Article Title
verse.num
1077
1076
1075
1074
1073
1072
1071
1070
1069
1067
1066
1065
lan.num
1409
20
14
5
4
2
3
5
1
2
2
3
verse.num
1064
1063
1061
1060
1057
1056
1055
1054
1053
1051
1049
1048
lan.num
3
1
2
3
1
2
3
1
1
1
1
3
verse.num
1044
1042
1041
1039
1038
1034
1017
1006
1000
989
961
949
lan.num
1
1
1
1
1
1
1
2
1
1
1
1
Table 5
An overview of the number of verses of different languages, for example: 1049 of
the languages have 1077 verses in the dataset.
4.1 The corpus: Taxi1500-c
To provide public access to our dataset, we have carefully selected uncopy-
righted Bibles from the PBC and 1000Langs. We then compiled a corpus
named Taxi1500-c, which includes all the Bibles that we can freely distribute.
The current version available is Taxi1500-c v1.0.
5 A Case Study for the Use of Taxi1500
To illustrate its utility, we use Taxi1500 to evaluate four pre-trained multilin-
gual models: mBERT, XLM-R-Base, XLM-R-Large, and Glot500-m. For a fair
comparison, we split languages in our dataset into three sets, namely head
languages, Glot500-only languages, and tail languages. Head languages
are languages that are in the pre-training data of all four models. Glot500-
only languages are languages that are only in the pre-training data of Glot500
and not the other three. Tail languages include languages that are not in the
pre-training data of any model. Of the 1504 languages, there are 73 head lan-
guages, 250 Glot500-only languages, and 1149 tail languages. We describe the
detailed experiment setup in 5.1 and present the metrics on the test set in 5.2.
5.1 Experimental Setup
We conduct experiments on zero-shot transfer and on in-language learning.
For all experiments, we select the best checkpoint based on the validation loss
and then report macro F1 score on the test set. We use the AdamW optimizer
with learning rate 2e −5 and batch size ∈{2, 8, 16, 32} and select the best
result based on development set. All experiments are performed on a single
GeForce GTX 1080Ti GPU.
Zero-shot transfer.
In zero-shot transfer, we train (i.e., finetune) on the
English training set and test on the test set of the target language.
In-language learning.
In in-language learning, we train (i.e., finetune) on
target language training data and test on the test set of the target language.
We vary the size of the target language training set and experiment with the
following training set sizes: {50, 100, 200, 400, 600, 860}. The training set size
860 corresponds to the full training set. This allows us to investigate the effect
of different amounts of training data.
Evaluation measure.
All results presented in this paper are macro-f1,
which is chosed considering the imbalance of Taxi1500 dataset.
Springer Nature 2021 LATEX template
Article Title
13
5.2 Results
In this section, we present experimental results on zero-shot transfer, in-
language learning, analysis of the effect of training set size and analysis based
on language families.
5.2.1 Zero-shot transfer
Baseline We conducted a Bag-of-Words (BOW) classification experiment
with our dataset and present the results as a baseline in Appendix C. The
experiment revealed extremely low accuracy for BOW, indicating that to clas-
sify verses in our dataset correctly, the models must have access to a good
semantic representation. The BOW representation does not seem to be such a
representation.
In figure 3, we show the results for 1504 languages, divided into three sets:
head languages (top), Glot500-only languages (middle), and tail languages
(bottom). On head languages, Glot500, XLM-L-B, and XLM-R-L have 68,
65, and 69 languages within the high F1 range (0.4-0.8), respectively, while
mBERT only has 26 languages within this range, indicating its worse perfor-
mance. This might be explained by a smaller pretraining data size of mBert
compared with the other three models. On Glot500-only languages, Glot500
outperforms the other three models with 117 languages in the range of 0.2-
0.8, whereas the other three models have less than 30 languages within this
range. Because Glot500-only languages are in the pre-training data of Glot500,
we expect Glot500 to achieve better results on these languages. On tail lan-
guages, Glot500 outperforms the other three models slightly with around 100
fewer languages in the range of 0-0.2. The reason might be that a larger num-
ber of pre-training languages contributes to higher performance for other tail
languages from the same family. The zero-shot transfer results indicate that
Taxi1500 can effectively demonstrate better performance for models pretrained
using more languages.
5.2.2 In-language learning
Figure 4 shows differences in F1 for the four models on head, Glot500-only,
and tail languages. We see that Glot500 and XLM-R-Base have better per-
formance than mBERT on head languages (most differences are positive).
XLM-R-Base outperforms Glot500 slightly on 11 head languages. On Glot500-
only languages, Glot500m outperforms the other three models as expected
with a larger number of positive differences. On tail languages, mBERT has
better performance than the other three models. This may be due to the other
models having larger numbers of parameters and thus being more prone to
overfitting.
5.2.3 Influence of training set size
To investigate the influence of the training set size, we conduct in-language
experiments with 20 selected languages, 10 head and 10 tail languages. We
Springer Nature 2021 LATEX template
14
Article Title
F1 of head languages
F1 of head Glot500-only languages
F1 of head tail languages
Fig. 3 Zero shot transfer learning: head languages (top), Glot500-only languages (middle)
and tail languages (bottom). X-axis is the number of languages, y-axis presents four models.
We split F1 scores into four ranges: 0-0.2, 0.2-0.4, 0.4-0.6 and 0.6-0.8.
select languages based on: 1) their inclusion in pretrained multilingual mod-
els, specifically whether they are pretrained by the four mentioned SOTA
PMLMs or not. 2) variation in typology to ensure coverage of different language
types and families, including a) high resource languages, and 2) low resource
languages pretrained by the SOTA PMLMs, as well as 3) low resource lan-
guages and 4) resource-scarce languages not covered by the SOTA PMLMs like
Hixkaryana. We present the iso codes, writing systems and language families of
the 20 languages in table 6. The languages are selected to represent 11 different
writing systems (Latin, Chinese, Korean, Japanese, Basque, Hebrew, Arabic,
Springer Nature 2021 LATEX template
Article Title
15
F1-differences of head languages
F1-differences of Glot500-only languages
F1-differences of tail languages
Fig. 4 F1-differences of in-language learning for 1504 languages. We split the F1-differences
between two models into six intervals: -0.4/-0.2, -0.2/-0.1, -0.1/0.0, 0.0/0.1,0.1/0.2, 0.2/0.4.
Each bar represents the comparison between a pair of models.
Malayalam, Cyrillic, Devanagari and Burmese) and 13 language families (Indo-
European, Sino-Tibetan, Koreanic, Japanic, Basque, Dravidian, Iroquoian,
Turkic, Cariban, Uralic, Austronesian, Uto-Aztecan and Central Sudanic).
Tables 7 and 8 show the results of zero-shot transfer and in-language experi-
ments using mBERT and XLM-R-Base for the selected languages. As expected,
the in-language performance improves when the training set becomes larger.
Interestingly, zero-shot transfer performance of head languages is comparable
to in-language setting with 100 samples for mBert and with 400 samples for
XLM-R-Base, which indicates that models with more parameters may require
Springer Nature 2021 LATEX template
16
Article Title
more in-language data to reach a comparable level with zero-shot transfer per-
formance. In addition, observing the average zero-shot transfer performance
of mBert and XLM-R-Base, XLM-R-Base achieves higher scores on both head
and tail languages, this might indicate a better overall performance of XLM-R-
Base on Taxi1500 classification task. Moreover, the zero-shot transfer results on
both models show that head languages consistently outperform tail languages,
which reflects both models’ better generalization capability on languages in
their pretraining data.
head lang.
iso
Script
Family
tail lang.
iso
Script
Family
German
deu
Latin
Indo-European
Cherokee
chr
Cherokee
Iroquoian
Basque
eus
Latin
Basque
Gagauz
gag
Latin
Turkic
Hebrew
heb
Hebrew
Afro-Asiatic
Hixkaryana
hix
Latin
Cariban
Japanese
jpn
Japanese
Japanic
Nga La
hlt
Latin
Sino-Tibetan
Kazakh
kaz
Cyrilic
Turkic
Komi-Zyrian
kpv
Cyrilic
Uralic
Korean
kor
Korean
Koreanic
Kumyk
kum
Cyrilic
Turkic
Malayalam
mal
Malayalam
Dravidian
Aringa
luc
Latin
Central Sudanic
Burmese
mya
Burmese
Indo-European
Magahi
mag
Devanagari
Indo-European
Persian
pes
Arabic
Indo-European
Dibabawon Manobo
mbd
Latin
Austronesian
Chinese
zho
Chinese
Sino-Tebietan
Middle Watut
npl
Latin
Uto-Aztecan
Table 6
An overview of selected 20 languages from 11 different writing systems and 13
language families
head
transfer
in-language training
tail
transfer
in-language training
lang.
50
100
200
400
600
860
lang.
50
100
200
400
600
860
deu
0.39
0.20
0.13
0.34
0.42
0.44
0.52
chr
0.05
0.24
0.21
0.29
0.35
0.30
0.35
eus
0.17
0.15
0.12
0.31
0.44
0.46
0.43
gag
0.12
0.21
0.29
0.35
0.39
0.45
0.38
heb
0.36
0.24
0.24
0.36
0.33
0.38
0.41
hix
0.07
0.30
0.27
0.35
0.35
0.39
0.41
jpn
0.39
0.37
0.40
0.32
0.49
0.63
0.66
hlt
0.08
0.16
0.25
0.33
0.34
0.44
0.49
kaz
0.29
0.30
0.36
0.38
0.50
0.48
0.48
kpv
0.08
0.19
0.24
0.45
0.41
0.39
0.46
kor
0.41
0.36
0.36
0.45
0.56
0.50
0.60
kum
0.14
0.28
0.27
0.35
0.37
0.42
0.46
mal
0.09
0.13
0.25
0.25
0.31
0.35
0.34
luc
0.08
0.27
0.23
0.46
0.41
0.45
0.35
mya
0.22
0.32
0.31
0.41
0.41
0.40
0.46
mag
0.19
0.14
0.38
0.38
0.37
0.43
0.34
pes
0.43
0.30
0.36
0.55
0.53
0.52
0.56
mbd
0.08
0.18
0.33
0.36
0.36
0.39
0.42
zho
0.36
0.24
0.46
0.47
0.62
0.54
0.59
npl
0.06
0.21
0.30
0.38
0.39
0.40
0.40
avg.
0.31
0.26
0.30
0.38
0.46
0.47
0.51
avg.
0.10
0.22
0.28
0.37
0.37
0.41
0.41
Table 7
Results of zero-shot transfer and in-language fine-tuning experiments using
mBERT for 20 selected languages, 10 head (left): German, Basque, Hebrew, Japanese,
Kazakh, Korean, Malayalam, Burmese, Persian and Chinese, and 10 tail (right): Cherokee,
Gagauz, Hixkaryana, Nga La, Komi-Zyrian, Kumyk, Aringa, Magahi, Dibabawon Manobo
and Middle Watut. The numbers in the table header indicate the size of target language
training data: 860 means the full training set.
5.2.4 Analysis by Language Family
In Figures 5 and 6, we present zero-shot transfer and in-language results
of all languages based on their families (Hammarstr¨om, 2015) on XLM-R-
Base and Glot500. For almost all families, the performance on head languages
is significantly higher than that of Glot500-only and tail languages. The
Springer Nature 2021 LATEX template
Article Title
17
head
transfer
in-language training
tail
transfer
in-language training
lang.
50
100
200
400
600
860
lang.
50
100
200
400
600
860
deu
0.52
0.16
0.18
0.43
0.49
0.52
0.51
chr
0.09
0.15
0.20
0.15
0.24
0.21
0.28
eus
0.26
0.09
0.26
0.25
0.34
0.37
0.34
gag
0.33
0.17
0.13
0.14
0.45
0.32
0.54
heb
0.15
0.10
0.13
0.18
0.16
0.33
0.35
hix
0.06
0.18
0.17
0.22
0.3
0.43
0.49
jpn
0.62
0.25
0.39
0.53
0.57
0.61
0.68
hlt
0.05
0.14
0.07
0.19
0.40
0.20
0.50
kaz
0.57
0.23
0.35
0.47
0.41
0.55
0.56
kpv
0.09
0.09
0.21
0.23
0.41
0.38
0.53
kor
0.63
0.35
0.55
0.58
0.65
0.53
0.70
kum
0.13
0.13
0.17
0.22
0.27
0.37
0.45
mal
0.07
0.10
0.13
0.22
0.08
0.21
0.24
luc
0.11
0.12
0.11
0.30
0.30
0.39
0.39
mya
0.42
0.18
0.30
0.21
0.45
0.45
0.64
mag
0.38
0.11
0.23
0.41
0.48
0.38
0.51
pes
0.66
0.17
0.55
0.47
0.65
0.64
0.71
mbd
0.11
0.18
0.14
0.25
0.30
0.30
0.38
zho
0.63
0.33
0.49
0.52
0.45
0.51
0.68
npl
0.05
0.14
0.08
0.25
0.41
0.41
0.43
avg.
0.45
0.20
0.33
0.39
0.43
0.47
0.54
avg.
0.14
0.14
0.15
0.24
0.36
0.34
0.45
Table 8
Results of zero-shot transfer and in-language fine-tuning experiments using
XLM-R-Base for 20 selected languages, 10 head (left): German, Basque, Hebrew, Japanese,
Kazakh, Korean, Malayalam, Burmese, Persian and Chinese, and 10 tail (right): Cherokee,
Gagauz, Hixkaryana, Nga La, Komi-Zyrian, Kumyk, Aringa, Magahi, Dibabawon Manobo
and Middle Watut. The numbers in the table header indicate the size of target language
training data: 860 means the full training set.
Indo-European family outperforms other language families not only on head
languages but also on Glot500-only and tail languages. We suppose the reason
is that the four evaluated models are pre-trained with more Indo-European
languages, which increases the performance of this family. We also notice that
XLM-R-Large tends to perform worse than the other three models on most
languages. We think this could be due to its larger number of parameters,
which makes it prone to overfitting on our small dataset. Interestingly, by
comparing zero-shot transfer and in-language results of XLM-R-Base, we find
that languages that are extremely low-resource and use non-Latin scripts (e.g.
Yawa-Saweru, Lengua-Mascoy, and Hmong-Mien) have significant performance
increases (around 0.4) when they are trained with in-language data. This indi-
cates that the four models do not perform as well on non-Latin scripts as on
Latin scripts.
6 Conclusion
A bottleneck for the evaluation of multilingual models is the lack of evalua-
tion data for many low-resource languages. Since annotating data for every
language is a prohibitively expensive and an unrealistic approach, there is an
increasing interest in evaluation data for low-resource languages. In this paper,
we introduce a text classification dataset, Taxi1500, which consists of anno-
tated Bible verses in 1504 languages. We obtain labels for the English verses
through crowdsourcing and project the labels to all other languages, making
use of parallel verses. We present several use cases of Taxi1500 by conduct-
ing a thorough evaluation of four multilingual language models. We hope the
high language coverage of Taxi1500 will encourage research on multilingual
language models, and especially, benefit low-resource languages that are, till
now, neglected due to the lack of evaluation data.
Springer Nature 2021 LATEX template
18
Article Title
Koreanic
Japonic
Kartvelian
Artificial Language
Indo-European
Dravidian
Uralic
Tai-Kadai
Basque
Turkic
Austroasiatic
Mongolic-Khitan
Austronesian
Manubaran
Aymaran
South Bougainville
Sino-Tibetan
Afro-Asiatic
Yuracaré
Cofán
Chiquitano
Pidgin
Iroquoian
Kuot
Pauwasi
Tupian
Songhay
Yareban
Chibchan
Maningrida
Mosetén-Chimané
Dagan
Naduhup
Warao
Tarascan
Geelvink Bay
East Bird's Head
Nakh-Daghestanian
Gumuz
Border
Baining
Camsá
Otomanguean
Barbacoan
Ndu
Zamucoan
Ainu
Mayan
Fasu
Jicaquean
Páez
Atlantic-Congo
Ta-Ne-Omotic
Cariban
Tucanoan
Kamula-Elevala
Anim
Nuclear Torricelli
Uto-Aztecan
Nilotic
Pano-Tacanan
Guahiboan
Matacoan
North Halmahera
Kunimaipan
Huavean
Pama-Nyungan
Bosavi
Abun
Eastern Trans-Fly
Cahuapanan
Guaicuruan
Yawa-Saweru
Arawakan
Arawan
Central Sudanic
Eleman
Huitotoan
Quechuan
Sepik
Tor-Orya
Nuclear Trans New Guinea
Nuclear-Macro-Je
Kakua-Nukak
Waorani
Totonacan
Koiarian
East Strickland
Pele-Ata
Surmic
Tabo
Lengua-Mascoy
Senagi
Candoshi-Shapra
Kru
Urarina
Yanomamic
Teberan
Uru-Chipaya
Peba-Yagua
Tequistlatecan
Dogon
Ticuna-Yuri
Sulka
Athabaskan-Eyak-Tlingit
Eskimo-Aleut
Gunwinyguan
Heibanic
Algic
Angan
Yele
Bookkeeping
Wiru
Mande
Hmong-Mien
North Bougainville
Araucanian
South Omotic
Boran
Harakmbut
Khoe-Kwadi
Mixe-Zoque
Zaparoan
Misumalpan
Lower Sepik-Ramu
Piawi
Chicham
Chocoan
Nambiquaran
Puinave
Koman
Left May
language family
0.1
0.2
0.3
0.4
0.5
0.6
0.7
F1
head
tail1
tail2
Koreanic
Kartvelian
Japonic
Indo-European
Turkic
Artificial Language
Dravidian
Uralic
Tai-Kadai
Basque
Mayan
Mongolic-Khitan
Austronesian
Quechuan
Tarascan
Austroasiatic
Abun
Gumuz
Sino-Tibetan
Totonacan
Afro-Asiatic
Jicaquean
Dagan
Mixe-Zoque
Huavean
Warao
Kamula-Elevala
Yuracaré
Atlantic-Congo
Aymaran
Ainu
Otomanguean
Guahiboan
Nakh-Daghestanian
Matacoan
Ta-Ne-Omotic
North Halmahera
Uto-Aztecan
South Bougainville
Manubaran
Araucanian
Koman
Kakua-Nukak
Tabo
Border
Fasu
Left May
Zamucoan
Barbacoan
Nilotic
Nuclear-Macro-Je
Misumalpan
Yanomamic
Khoe-Kwadi
Central Sudanic
Guaicuruan
Lengua-Mascoy
Nuclear Torricelli
Páez
Camsá
Ndu
Pidgin
Songhay
Eskimo-Aleut
Pauwasi
Sepik
Mande
Surmic
Cofán
Pama-Nyungan
Ticuna-Yuri
Eastern Trans-Fly
Tequistlatecan
Tucanoan
East Bird's Head
Chibchan
Tupian
Arawan
Arawakan
Nuclear Trans New Guinea
Pano-Tacanan
Dogon
Yareban
Yawa-Saweru
Naduhup
Anim
Puinave
Huitotoan
Cahuapanan
Teberan
Pele-Ata
Chicham
Tor-Orya
Chiquitano
Kunimaipan
Cariban
Bookkeeping
Algic
Waorani
Athabaskan-Eyak-Tlingit
Senagi
Kuot
Chocoan
Heibanic
Gunwinyguan
South Omotic
Lower Sepik-Ramu
Angan
Yele
Eleman
Uru-Chipaya
Iroquoian
Harakmbut
Peba-Yagua
East Strickland
Wiru
Zaparoan
Sulka
Baining
Piawi
Geelvink Bay
Hmong-Mien
Koiarian
Bosavi
Kru
Candoshi-Shapra
Urarina
North Bougainville
Nambiquaran
Boran
Maningrida
Mosetén-Chimané
language family
0.1
0.2
0.3
0.4
0.5
0.6
0.7
F1
head
tail1
tail2
Fig. 5 Zero shot transfer learning: F1 of XLM-R-Base (top) and Glot500 (bottom). Each small dot represents a language, each large dot an average
per family. Families are sorted by F1. Red, yellow and blue represent head, Glot500-only and tail languages respectively.
Springer Nature 2021 LATEX template
Article Title
19
Koreanic
Japonic
Cofán
Uralic
Indo-European
Kartvelian
Manubaran
Pidgin
Ainu
Tor-Orya
Turkic
Dravidian
Abun
Aymaran
Yawa-Saweru
Cahuapanan
Sepik
Eastern Trans-Fly
Hmong-Mien
Ndu
North Halmahera
Candoshi-Shapra
Border
Jicaquean
Tequistlatecan
Chocoan
Kamula-Elevala
Austroasiatic
Quechuan
Senagi
Misumalpan
Harakmbut
Lengua-Mascoy
Kunimaipan
Yanomamic
Urarina
Dagan
Pano-Tacanan
Arawan
Austronesian
Sino-Tibetan
Mande
Piawi
Tucanoan
Boran
Mosetén-Chimané
Nuclear Torricelli
Eleman
Songhay
Cariban
Tarascan
Koiarian
Uto-Aztecan
Yuracaré
Wiru
Tai-Kadai
Barbacoan
East Bird's Head
Maningrida
Fasu
Pama-Nyungan
Huavean
Totonacan
Mayan
Otomanguean
Guaicuruan
Mongolic-Khitan
Matacoan
Koman
Chibchan
Camsá
Nuclear Trans New Guinea
Ta-Ne-Omotic
Pauwasi
Arawakan
Yareban
Warao
Páez
Tupian
Dogon
Teberan
Zaparoan
Chiquitano
Atlantic-Congo
Anim
Baining
Sulka
Central Sudanic
Gumuz
Huitotoan
Bookkeeping
Afro-Asiatic
Lower Sepik-Ramu
Nuclear-Macro-Je
Mixe-Zoque
North Bougainville
Athabaskan-Eyak-Tlingit
Nilotic
Kakua-Nukak
Zamucoan
Nakh-Daghestanian
Kru
Guahiboan
Kuot
Chicham
Khoe-Kwadi
Tabo
Basque
Uru-Chipaya
South Omotic
Araucanian
Naduhup
Bosavi
Left May
Artificial Language
South Bougainville
Eskimo-Aleut
Waorani
Geelvink Bay
Pele-Ata
Heibanic
Ticuna-Yuri
Surmic
Peba-Yagua
East Strickland
Puinave
Gunwinyguan
Iroquoian
Angan
Nambiquaran
Yele
Algic
language family
0.1
0.2
0.3
0.4
0.5
0.6
0.7
F1
head
tail1
tail2
Pidgin
Koreanic
Artificial Language
Turkic
Hmong-Mien
Kartvelian
Indo-European
Aymaran
Quechuan
Tabo
Dravidian
Japonic
Araucanian
Misumalpan
Ticuna-Yuri
Teberan
Cofán
Cahuapanan
Basque
Uralic
Tarascan
Mayan
Manubaran
Khoe-Kwadi
Dogon
Gunwinyguan
Uto-Aztecan
Harakmbut
Eleman
Ta-Ne-Omotic
Tequistlatecan
Anim
Austronesian
Nuclear Torricelli
Geelvink Bay
Eastern Trans-Fly
Sino-Tibetan
Songhay
Chicham
Tor-Orya
Huavean
Left May
Mande
Yanomamic
Austroasiatic
Ainu
Bosavi
Ndu
Pele-Ata
Chiquitano
Mongolic-Khitan
East Bird's Head
Lengua-Mascoy
Lower Sepik-Ramu
Yareban
Otomanguean
Totonacan
Kamula-Elevala
Atlantic-Congo
South Omotic
Nuclear-Macro-Je
Tupian
Dagan
Pano-Tacanan
Puinave
Sepik
Chibchan
Tucanoan
Nakh-Daghestanian
Kuot
Sulka
North Halmahera
Guaicuruan
Barbacoan
Matacoan
Yele
Uru-Chipaya
Angan
Koman
Nuclear Trans New Guinea
East Strickland
Afro-Asiatic
Fasu
Central Sudanic
Mixe-Zoque
Boran
Baining
Huitotoan
Guahiboan
Páez
North Bougainville
Pama-Nyungan
Kakua-Nukak
Cariban
Bookkeeping
Zamucoan
Arawakan
Heibanic
Zaparoan
Chocoan
Kunimaipan
Peba-Yagua
Arawan
Naduhup
Maningrida
Pauwasi
Iroquoian
Kru
Eskimo-Aleut
Nilotic
Urarina
Athabaskan-Eyak-Tlingit
Tai-Kadai
Surmic
Algic
Koiarian
Abun
Yawa-Saweru
Camsá
Piawi
Gumuz
Waorani
Mosetén-Chimané
Border
Senagi
Nambiquaran
Candoshi-Shapra
Yuracaré
Jicaquean
Warao
Wiru
South Bougainville
language family
0.1
0.2
0.3
0.4
0.5
0.6
0.7
0.8
F1
head
tail1
tail2
Fig. 6 In-language results: F1 of XLM-R-Base (top) and Glot500 (bottom). Each small dot represents a language, each large dot an average per
family. Families are sorted by F1. Red, yellow and blue represent head, Glot500-only and tail languages respectively.
Springer Nature 2021 LATEX template
20
Article Title
7 Limitations
While the high degree of parallelism in the PBC makes it a valuable tool
for massively multilingual applications, such as the building of Taxi1500, it is
not perfect. One limitation is the religious domain of the Bible, which means
keywords specific to the domain may be exploited. Also, we are restricted to the
New Testament, as many languages do not have a translated Old Testament
in the PBC. Given that some extremely low-resource languages do not have
complete translations, the actual number of available verses varies for each
language. However, since the Bible is arguably the most translated book in
the world, we regard it as a suitable resource for an initiative to build highly
parallel dataset like ours.
8 Failure analysis
In this section, we present a path of methods used when designing categories
for the sentence classification task and the difficulties met during the data
annotation process.
8.1 Category design
We have developed seven versions of topics in total (shown in table 9), each
new one based on the refinements of the previous version. This is done by
collecting feedback from NLP experts and workers from Amazon MTurk.
We conclude a few of the reasons why earlier versions of topics fail as
follows:
1. Lack of domain knowledge. In the first version, we read the Bible and come
up with our own topics. Due to limited background knowledge of the reli-
gious domain, the first topics are rather arbitrary and do not cover sufficient
verses. For the second version, we consult a theologist and online preaching
websites that contain a large number of topics, from which we select ones
that cover a high number of verses.
2. Obscure or abstract topics. Verses in v2 are collected from an online preach-
ing website, ProPreacher9. We sample 100 verses and ask for feedback from
crowdsourcing workers on them. Many workers think several topics are very
hard to understand or recognize from the verses, for example, Eschatology,
Philosophy, Theology and Moral. Therefore, v3 deletes four abstract top-
ics, Eschatology, Philosophy, Theology, and Moral, and adds five new ones,
Repentance, Friendship, Thankfulness, Forgiveness and Suffering, which are
easier to understand.
3. Overlap between topics. v4 is the version we use to crowdsource annotation
on Amazon Mechanical Turk. However, we get feedback indicating that
many verses can be assigned multiple topics, such as Violence and Conflict.
Therefore, in v5 and v6 we combine similar topics in v4 and change the
9https://www.propreacher.com/100
Springer Nature 2021 LATEX template
Article Title
21
names of several labels. v7 is the version that contains the final topics in
Taxi1500.
Version
Topics
Num. topics
v1
Rules, Phenomenon, Conflict, Relation, Place, Charac-
ter, Reward, Punishment, Command
9
v2
Eschatology,
Grace,
Family,
Creation,
Philosophy,
Revival, Cults, Compromise, Persecution, Hospitality,
Conflicts, Theology, Morals, Commandments, Sacrifice
15
v3
Creation, Grace, Violence, Conflict, Hospitality, Sacri-
fice, Heresy, Repentance, Faith, Suffering, Forgiveness,
Thankfulness, Friendship, Temptation
14
v4
Creation, Grace, Violence, Conflict, Hospitality, Sacri-
fice, Heresy, Repentance, Faith, Suffering, Forgiveness,
Thankfulness
12
v5
Creation, Commandment, Genealogy, Violence, Sacri-
fice, Money, Salvation, Sin
8
v6
Creation, Commandment, Genealogy, Violence, Sacri-
fice, Money, Grace, Sin
8
v7
Recommendation, Faith, Description, Sin, Grace, Vio-
lence
6
Table 9 An overview of different versions of designed categories. v7 is the final version for
Taxi1500
8.2 Data annotation
We choose Amazon Mechanical Turk (MTurk) for data annotation because of
the availability of a large number of native English speakers. Besides, its usage
is well documented in online tutorials for building annotation projects.
Based on our experience, we provide some tips based on our failure when
using Amazon MTurk as follows:
1. Although the lowest payment for every HIT is 0.01 US dollars, workers
seldom do the task for the minimum payment. It is recommended to set a
higher payment if possible.
2. It is not advisable to reject HITs if the requester is new to MTurk, lest
the requester’s approval rate drops significantly, which will attract fewer
workers.
3. Clear instruction and a qualification test prior to permitting workers to
annotate are strongly recommended for high-quality data.
4. It is better to test with a smaller batch first before uploading all data
for annotation because there can be errors in the instruction or the data
submitted.
5. Workers may have valuable opinions about the task and it is a good idea
to contact them for feedback.
Springer Nature 2021 LATEX template
22
Article Title
9 Ethics Statement
In this work, we introduce a new multilingual text classification dataset based
on the Parallel Bible Corpus. The data is partially annotated by workers from
the Amazon mTurk platform, who are rewarded fairly for their work ($0.2 per
sentence). Our dataset contains Bible verses for which we estimate a low risk of
tracing to specific individuals and are intended exclusively for the evaluation
of NLP tasks concerning the supported languages. We therefore do not expect
any ethical issues with our dataset.
Declarations
Funding.
This work is funded by the European Research Council (grant no.
740516).
Conflicts of interest.
We do not foresee any conflicts of interest with this
work.
Author contributions.
Main manuscript text: Chunlan Ma; Tables 2.1, 2,
2, 5, 7, 8: Chunlan Ma; Tables 3, 4, 6: Haotian Ye; Figures 3, 4: Haotian Ye;
Review and revision of the manuscript: all authors.
Data availability.
Part of the data analyzed for the current study is
not publicly available due to copyright restrictions. It is available from the
corresponding author upon reasonable request.
References
Adebara I, Elmadany A, Abdul-Mageed M, et al (2022) Serengeti: Massively
multilingual language models for africa. 2212.10785
Agi´c ˇZ, Vuli´c I (2019) JW300: A wide-coverage parallel corpus for low-resource
languages. In: Proceedings of the 57th Annual Meeting of the Association
for Computational Linguistics. Association for Computational Linguistics,
Florence, Italy, pp 3204–3210, https://doi.org/10.18653/v1/P19-1310, URL
https://aclanthology.org/P19-1310
Alabi JO, Adelani DI, Mosbach M, et al (2022) Adapting pre-trained language
models to African languages via multilingual adaptive fine-tuning. In: Pro-
ceedings of the 29th International Conference on Computational Linguistics.
International Committee on Computational Linguistics, Gyeongju, Republic
of Korea, pp 4336–4349, URL https://aclanthology.org/2022.coling-1.382
Artetxe M, Schwenk H (2019) Massively multilingual sentence embeddings
for zero-shot cross-lingual transfer and beyond. Transactions of the Asso-
ciation for Computational Linguistics 7:597–610. https://doi.org/10.1162/
tacl a 00288, URL https://aclanthology.org/Q19-1038
Springer Nature 2021 LATEX template
Article Title
23
Artetxe M, Ruder S, Yogatama D (2019) On the cross-lingual transferability
of monolingual representations. arXiv preprint arXiv:191011856
Clark K, Luong MT, Le QV, et al (2020) Electra: Pre-training text encoders
as discriminators rather than generators. 2003.10555
Conneau A, Khandelwal K, Goyal N, et al (2020) Unsupervised cross-lingual
representation learning at scale. In: Proceedings of the 58th Annual Meeting
of the Association for Computational Linguistics. Association for Computa-
tional Linguistics, Online, pp 8440–8451, https://doi.org/10.18653/v1/2020.
acl-main.747, URL https://aclanthology.org/2020.acl-main.747
De Marneffe MC, Dozat T, Silveira N, et al (2014) Universal stanford
dependencies: A cross-linguistic typology. In: Proceedings of the Ninth Inter-
national Conference on Language Resources and Evaluation (LREC’14), pp
4585–4592
De Marneffe MC, Manning CD, Nivre J, et al (2021) Universal dependencies.
Computational linguistics 47(2):255–308
Devlin J, Chang M, Lee K, et al (2018) BERT: pre-training of deep bidi-
rectional transformers for language understanding. CoRR abs/1810.04805.
URL http://arxiv.org/abs/1810.04805, https://arxiv.org/abs/1810.04805
Eisenschlos J, Ruder S, Czapla P, et al (2019) Multifit: Efficient multi-lingual
language model fine-tuning. CoRR abs/1909.04761. URL http://arxiv.org/
abs/1909.04761, https://arxiv.org/abs/1909.04761
Hammarstr¨om H (2015) Glottolog: A free, online, comprehensive bibliography
of the world’s languages. In: 3rd International Conference on Linguistic and
Cultural Diversity in Cyberspace, UNESCO, pp 183–188
Hu J, Ruder S, Siddhant A, et al (2020) XTREME: A massively multilin-
gual multi-task benchmark for evaluating cross-lingual generalization. CoRR
abs/2003.11080. URL https://arxiv.org/abs/2003.11080, https://arxiv.org/
abs/2003.11080
ImaniGooghari A, Lin P, Kargaran AH, et al (2023) Glot500: Scaling multi-
lingual corpora and language models to 500 languages. In: Proceedings of
the 61st Annual Meeting of the Association for Computational Linguistics.
Joshi P, Santy S, Budhiraja A, et al (2020) The state and fate of lin-
guistic diversity and inclusion in the NLP world. In: Proceedings of the
58th Annual Meeting of the Association for Computational Linguistics.
Association for Computational Linguistics, Online, pp 6282–6293, https:
//doi.org/10.18653/v1/2020.acl-main.560, URL https://aclanthology.org/
2020.acl-main.560
Springer Nature 2021 LATEX template
24
Article Title
Klementiev A, Titov I, Bhattarai B (2012) Inducing crosslingual distributed
representations of words. In: Proceedings of COLING 2012, pp 1459–1474
Koehn P (2005) Europarl: A parallel corpus for statistical machine transla-
tion. In: Proceedings of Machine Translation Summit X: Papers, Phuket,
Thailand, pp 79–86, URL https://aclanthology.org/2005.mtsummit-papers.
11
Kunchukuttan A, Mehta P, Bhattacharyya P (2018) The IIT Bombay
English-Hindi parallel corpus. In: Proceedings of the Eleventh Interna-
tional Conference on Language Resources and Evaluation (LREC 2018).
European Language Resources Association (ELRA), Miyazaki, Japan, URL
https://aclanthology.org/L18-1548
Lample G, Conneau A (2019) Cross-lingual language model pretraining. CoRR
abs/1901.07291. URL http://arxiv.org/abs/1901.07291, https://arxiv.org/
abs/1901.07291
Lewis DD, Yang Y, Russell-Rose T, et al (2004) Rcv1: A new benchmark col-
lection for text categorization research. Journal of machine learning research
5(Apr):361–397
Lewis P, Oguz B, Rinott R, et al (2020) MLQA: Evaluating cross-lingual
extractive question answering. In: Proceedings of the 58th Annual Meeting
of the Association for Computational Linguistics. Association for Computa-
tional Linguistics, Online, pp 7315–7330, https://doi.org/10.18653/v1/2020.
acl-main.653, URL https://aclanthology.org/2020.acl-main.653
Liu Y, Ott M, Goyal N, et al (2019) Roberta: A robustly optimized BERT
pretraining approach. CoRR abs/1907.11692. URL http://arxiv.org/abs/
1907.11692, https://arxiv.org/abs/1907.11692
Mayer T, Cysouw M (2014) Creating a massively parallel Bible corpus. In:
Proceedings of the Ninth International Conference on Language Resources
and Evaluation (LREC’14). European Language Resources Association
(ELRA), Reykjavik, Iceland, pp 3158–3163, URL http://www.lrec-conf.org/
proceedings/lrec2014/pdf/220 Paper.pdf
Mogadala A, Rettinger A (2016) Bilingual word embeddings from parallel and
non-parallel corpora for cross-language text classification. In: Proceedings
of the 2016 Conference of the North American Chapter of the Association
for Computational Linguistics: Human Language Technologies, pp 692–702
Nzeyimana A, Rubungo AN (2022) KinyaBERT: a morphology-aware kin-
yarwanda language model. In: Proceedings of the 60th Annual Meeting of the
Association for Computational Linguistics (Volume 1: Long Papers). Asso-
ciation for Computational Linguistics, https://doi.org/10.18653/v1/2022.
Springer Nature 2021 LATEX template
Article Title
25
acl-long.367, URL https://doi.org/10.18653%2Fv1%2F2022.acl-long.367
Ogueji K, Zhu Y, Lin J (2021) Small data? no problem! exploring the
viability of pretrained multilingual language models for low-resourced lan-
guages. In: Proceedings of the 1st Workshop on Multilingual Representation
Learning. Association for Computational Linguistics, Punta Cana, Domini-
can Republic, pp 116–126, https://doi.org/10.18653/v1/2021.mrl-1.11, URL
https://aclanthology.org/2021.mrl-1.11
Pan X, Zhang B, May J, et al (2017) Cross-lingual name tagging and linking
for 282 languages. In: Proceedings of the 55th Annual Meeting of the Asso-
ciation for Computational Linguistics (Volume 1: Long Papers). Association
for Computational Linguistics, Vancouver, Canada, pp 1946–1958, https:
//doi.org/10.18653/v1/P17-1178, URL https://aclanthology.org/P17-1178
Petrov S, Das D, McDonald R (2012) A universal part-of-speech tagset. In:
Proceedings of the Eighth International Conference on Language Resources
and Evaluation (LREC’12). European Language Resources Association
(ELRA), Istanbul, Turkey, pp 2089–2096, URL http://www.lrec-conf.org/
proceedings/lrec2012/pdf/274 Paper.pdf
Price I, Gifford-Moore J, Flemming J, et al (2020) Six attributes of unhealthy
conversations. In: Proceedings of the Fourth Workshop on Online Abuse
and Harms. Association for Computational Linguistics, Online, pp 114–124,
https://doi.org/10.18653/v1/2020.alw-1.15, URL https://aclanthology.org/
2020.alw-1.15
Rajpurkar P, Zhang J, Lopyrev K, et al (2016) SQuAD: 100,000+ questions
for machine comprehension of text. In: Proceedings of the 2016 Confer-
ence on Empirical Methods in Natural Language Processing. Association for
Computational Linguistics, Austin, Texas, pp 2383–2392, https://doi.org/
10.18653/v1/D16-1264, URL https://aclanthology.org/D16-1264
Rosen A (2010) Morphological Tags in Parallel Corpora, pp 205–234
Schwenk H, Li X (2018) A corpus for multilingual document classification
in eight languages. In: Proceedings of the Eleventh International Con-
ference on Language Resources and Evaluation (LREC 2018). European
Language Resources Association (ELRA), Miyazaki, Japan, URL https:
//aclanthology.org/L18-1560
Tiedemann J (2012) Parallel data, tools and interfaces in OPUS. In: Chair)
NCC, Choukri K, Declerck T, et al (eds) Proceedings of the Eight Inter-
national Conference on Language Resources and Evaluation (LREC’12).
European Language Resources Association (ELRA), Istanbul, Turkey
Springer Nature 2021 LATEX template
26
Article Title
Williams A, Nangia N, Bowman S (2018) A broad-coverage challenge cor-
pus for sentence understanding through inference. In: Proceedings of the
2018 Conference of the North American Chapter of the Association for
Computational Linguistics: Human Language Technologies, Volume 1 (Long
Papers). Association for Computational Linguistics, pp 1112–1122, URL
http://aclweb.org/anthology/N18-1101
Ziemski M, Junczys-Dowmunt M, Pouliquen B (2016) The United Nations
parallel corpus v1.0. In: Proceedings of the Tenth International Conference
on Language Resources and Evaluation (LREC’16). European Language
Resources Association (ELRA), Portoroˇz, Slovenia, pp 3530–3534, URL
https://aclanthology.org/L16-1561
Appendix A
Annotation interface
Figure A1 shows a screenshot of the annotation interface. Workers are asked
to select one label for each verse among six labels. If they think one verse does
not belong to any of them, the workers should classify this verse into Other.
Fig. A1 mTurk interface with English instructions and verse examples
Appendix B
Data collection
Our dataset is built based on PBC and 1000Langs. Due to the copyright issue,
our dataset consists of three parts:
• 1403 editions in 670 languages with permissive licenses which we distribute
freely (the corpus we call Taxi1500-c v1.0).
• For the remaining PBC Bibles, please contact Michael Cysouw at Philipps
University of Marburg to request access to PBC. Once granted access, run
the code available at https://github.com/cisnlp/Taxi1500/corpus obtain to
obtain the labeled dataset.
• For the remaining 1000Langs Bibles, use the code provided at https://
github.com/ehsanasgari/1000Langs to crawl the corpus. Then, run the code
Springer Nature 2021 LATEX template
Article Title
27
available at https://github.com/cisnlp/Taxi1500/corpus obtain to obtain
the labeled dataset.
Appendix C
Results for zero-shot
We report the detailed results for zero-shot transfer of BOW, mBERT, XLM-
R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
28
Article Title
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
aah Latn
0.13
0.10
0.05
0.05
0.08
aoz Latn
0.21
0.13
0.07
0.05
0.07
aai Latn
0.22
0.15
0.09
0.05
0.09
apb Latn
0.07
0.08
0.06
0.05
0.12
aak Latn
0.07
0.13
0.05
0.05
0.05
ape Latn
0.13
0.13
0.05
0.05
0.07
aau Latn
0.12
0.12
0.06
0.05
0.10
apn Latn
0.07
0.19
0.06
0.05
0.05
aaz Latn
0.07
0.12
0.05
0.05
0.08
apr Latn
0.07
0.07
0.07
0.05
0.05
abi Latn
0.07
0.11
0.05
0.05
0.05
apt Latn
0.08
0.14
0.07
0.05
0.07
abt Latn
0.09
0.13
0.08
0.05
0.06
apu Latn
0.07
0.09
0.10
0.05
0.05
abx Latn
0.16
0.12
0.20
0.14
0.33
apw Latn
0.15
0.10
0.05
0.05
0.05
aby Latn
0.21
0.12
0.07
0.07
0.06
apy Latn
0.09
0.09
0.11
0.05
0.05
acd Latn
0.13
0.08
0.05
0.05
0.05
apz Latn
0.07
0.11
0.05
0.05
0.05
ace Latn
0.13
0.25
0.11
0.11
0.30
are Latn
0.11
0.12
0.05
0.05
0.05
acf Latn
0.09
0.25
0.06
0.05
0.38
arl Latn
0.15
0.14
0.05
0.05
0.05
ach Latn
0.13
0.12
0.05
0.05
0.08
arn Latn
0.13
0.08
0.05
0.05
0.08
acn Latn
0.07
0.10
0.05
0.05
0.05
ary Arab
0.07
0.28
0.19
0.27
0.19
acr Latn
0.16
0.14
0.06
0.05
0.30
arz Arab
0.07
0.43
0.32
0.47
0.25
acu Latn
0.10
0.10
0.05
0.05
0.08
asg Latn
0.08
0.11
0.05
0.05
0.06
ade Latn
0.12
0.10
0.07
0.05
0.06
asm Beng
0.07
0.17
0.43
0.47
0.51
adh Latn
0.13
0.15
0.07
0.05
0.07
aso Latn
0.15
0.12
0.05
0.05
0.05
adi Latn
0.09
0.10
0.14
0.05
0.09
ata Latn
0.11
0.12
0.06
0.05
0.06
adj Latn
0.17
0.08
0.05
0.05
0.05
atb Latn
0.10
0.09
0.07
0.05
0.06
adl Latn
0.08
0.18
0.05
0.05
0.05
atd Latn
0.11
0.09
0.05
0.05
0.05
aeb Arab
0.07
0.38
0.19
0.42
0.30
atg Latn
0.10
0.11
0.07
0.05
0.07
aer Latn
0.07
0.08
0.08
0.05
0.05
atq Latn
0.13
0.15
0.06
0.05
0.13
aeu Latn
0.07
0.13
0.05
0.05
0.05
att Latn
0.14
0.10
0.08
0.05
0.16
aey Latn
0.07
0.12
0.09
0.05
0.05
auc Latn
0.09
0.13
0.06
0.05
0.05
afr Latn
0.33
0.45
0.59
0.66
0.52
auy Latn
0.07
0.07
0.04
0.05
0.06
agd Latn
0.09
0.16
0.06
0.08
0.07
ava Cyrl
0.07
0.06
0.05
0.05
0.10
agg Latn
0.14
0.06
0.05
0.05
0.05
avn Latn
0.14
0.12
0.05
0.05
0.05
agm Latn
0.07
0.11
0.06
0.05
0.05
avt Latn
0.10
0.11
0.05
0.05
0.14
agn Latn
0.12
0.16
0.13
0.18
0.35
avu Latn
0.07
0.06
0.04
0.05
0.05
agr Latn
0.07
0.11
0.05
0.05
0.05
awa Deva
0.07
0.24
0.37
0.40
0.48
agt Latn
0.07
0.10
0.06
0.05
0.10
awb Latn
0.08
0.11
0.06
0.05
0.05
agu Latn
0.11
0.09
0.04
0.05
0.06
awi Latn
0.17
0.12
0.04
0.05
0.14
agw Latn
0.20
0.13
0.11
0.07
0.24
ayo Latn
0.12
0.12
0.10
0.05
0.08
ahk Latn
0.08
0.11
0.07
0.05
0.07
ayp Arab
0.07
0.30
0.29
0.35
0.43
aia Latn
0.23
0.13
0.05
0.05
0.08
ayr Latn
0.07
0.12
0.11
0.06
0.10
aii Syrc
0.07
0.05
0.05
0.09
0.10
azb Arab
0.07
0.16
0.15
0.08
0.34
aim Latn
0.10
0.14
0.06
0.05
0.05
aze Latn
0.07
0.32
0.56
0.68
0.59
ain Latn
0.11
0.09
0.07
0.05
0.10
azg Latn
0.04
0.09
0.05
0.05
0.05
aji Latn
0.13
0.14
0.05
0.05
0.05
azz Latn
0.14
0.15
0.06
0.06
0.10
ajz Latn
0.12
0.12
0.05
0.05
0.07
bak Cyrl
0.07
0.33
0.13
0.05
0.24
aka Latn
0.12
0.17
0.10
0.06
0.13
bam Latn
0.09
0.11
0.06
0.05
0.20
akb Latn
0.13
0.16
0.15
0.07
0.27
ban Latn
0.07
0.16
0.16
0.09
0.31
ake Latn
0.11
0.08
0.05
0.05
0.05
bao Latn
0.10
0.14
0.08
0.05
0.06
akh Latn
0.10
0.15
0.05
0.05
0.05
bar Latn
0.13
0.19
0.30
0.29
0.41
akp Latn
0.10
0.16
0.06
0.05
0.05
bav Latn
0.12
0.05
0.05
0.05
0.06
ald Latn
0.08
0.05
0.05
0.05
0.05
bba Latn
0.13
0.12
0.05
0.05
0.05
alj Latn
0.11
0.14
0.10
0.10
0.21
bbb Latn
0.07
0.09
0.05
0.05
0.05
aln Latn
0.07
0.25
0.46
0.53
0.55
bbj Latn
0.12
0.05
0.05
0.05
0.05
alp Latn
0.10
0.19
0.13
0.06
0.20
bbk Latn
0.09
0.04
0.05
0.05
0.05
alq Latn
0.09
0.11
0.05
0.05
0.05
bbo Latn
0.10
0.12
0.07
0.05
0.06
als Latn
0.07
0.24
0.45
0.54
0.49
bbr Latn
0.17
0.15
0.04
0.05
0.06
alt Cyrl
0.07
0.16
0.17
0.19
0.37
bch Latn
0.10
0.13
0.07
0.05
0.12
alz Latn
0.10
0.15
0.06
0.05
0.17
bci Latn
0.09
0.12
0.04
0.05
0.15
ame Latn
0.09
0.11
0.09
0.05
0.05
bcl Latn
0.07
0.18
0.26
0.20
0.46
amf Latn
0.07
0.08
0.05
0.05
0.05
bcw Latn
0.12
0.05
0.06
0.05
0.05
amh Ethi
0.07
0.05
0.10
0.05
0.07
bdd Latn
0.11
0.07
0.05
0.05
0.05
amk Latn
0.13
0.19
0.06
0.05
0.07
bdh Latn
0.07
0.10
0.05
0.05
0.05
amm Latn
0.09
0.07
0.04
0.05
0.08
bdq Latn
0.10
0.12
0.05
0.05
0.05
amn Latn
0.11
0.11
0.07
0.05
0.12
bef Latn
0.10
0.10
0.07
0.05
0.07
amp Latn
0.07
0.12
0.06
0.05
0.05
bel Cyrl
0.07
0.43
0.59
0.67
0.59
amr Latn
0.09
0.12
0.05
0.05
0.05
bem Latn
0.14
0.11
0.08
0.09
0.31
amu Latn
0.06
0.08
0.05
0.05
0.05
ben Beng
0.07
0.32
0.56
0.67
0.63
anm Latn
0.13
0.14
0.06
0.05
0.05
beq Latn
0.14
0.14
0.09
0.05
0.10
ann Latn
0.14
0.15
0.08
0.05
0.06
bex Latn
0.13
0.10
0.05
0.05
0.08
anv Latn
0.13
0.13
0.05
0.05
0.08
bfd Latn
0.11
0.09
0.05
0.05
0.05
any Latn
0.07
0.07
0.05
0.05
0.05
bfo Latn
0.10
0.11
0.05
0.05
0.06
aoj Latn
0.20
0.09
0.08
0.05
0.06
bgr Latn
0.16
0.17
0.07
0.05
0.30
aom Latn
0.23
0.16
0.05
0.05
0.05
bgs Latn
0.15
0.14
0.09
0.07
0.11
aon Latn
0.08
0.11
0.06
0.05
0.05
bgt Latn
0.15
0.16
0.07
0.05
0.16
Table C1 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
Article Title
29
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
bgz Latn
0.09
0.18
0.09
0.06
0.15
bzj Latn
0.24
0.15
0.13
0.06
0.35
bhl Latn
0.10
0.12
0.06
0.05
0.07
caa Latn
0.14
0.15
0.07
0.05
0.12
bhp Latn
0.09
0.11
0.16
0.06
0.09
cab Latn
0.07
0.10
0.05
0.05
0.05
bhw Latn
0.09
0.16
0.07
0.05
0.14
cac Latn
0.12
0.12
0.06
0.05
0.21
bhz Latn
0.18
0.14
0.06
0.05
0.06
caf Latn
0.09
0.07
0.05
0.05
0.05
bib Latn
0.16
0.06
0.05
0.05
0.06
cag Latn
0.07
0.14
0.05
0.05
0.11
big Latn
0.09
0.10
0.05
0.05
0.05
cak Latn
0.04
0.12
0.05
0.05
0.42
bim Latn
0.14
0.13
0.05
0.05
0.06
cao Latn
0.08
0.10
0.05
0.05
0.10
bis Latn
0.16
0.22
0.14
0.06
0.24
cap Latn
0.11
0.09
0.05
0.05
0.05
biu Latn
0.16
0.14
0.05
0.05
0.17
caq Latn
0.10
0.10
0.04
0.05
0.10
biv Latn
0.11
0.07
0.05
0.05
0.05
car Latn
0.13
0.12
0.06
0.05
0.06
bjr Latn
0.07
0.10
0.05
0.05
0.05
cas Latn
0.15
0.09
0.08
0.05
0.04
bjv Latn
0.11
0.08
0.06
0.05
0.05
cat Latn
0.13
0.41
0.58
0.64
0.47
bkd Latn
0.07
0.21
0.15
0.08
0.21
cav Latn
0.07
0.11
0.06
0.05
0.05
bkl Latn
0.15
0.11
0.06
0.07
0.05
cax Latn
0.07
0.12
0.09
0.05
0.06
bkq Latn
0.14
0.12
0.06
0.05
0.11
cbc Latn
0.08
0.14
0.06
0.05
0.05
bku Latn
0.15
0.11
0.08
0.06
0.19
cbi Latn
0.14
0.13
0.09
0.05
0.11
bkv Latn
0.13
0.06
0.06
0.05
0.09
cbk Latn
0.11
0.39
0.45
0.48
0.57
blh Latn
0.05
0.07
0.05
0.05
0.05
cbr Latn
0.13
0.15
0.05
0.05
0.05
blt Latn
0.11
0.08
0.07
0.05
0.06
cbs Latn
0.05
0.15
0.05
0.05
0.06
blw Latn
0.07
0.15
0.06
0.05
0.10
cbt Latn
0.08
0.09
0.06
0.05
0.06
blz Latn
0.15
0.19
0.09
0.06
0.12
cbu Latn
0.07
0.12
0.05
0.05
0.05
bmb Latn
0.14
0.14
0.09
0.05
0.10
cbv Latn
0.09
0.15
0.06
0.05
0.08
bmh Latn
0.07
0.11
0.08
0.05
0.08
cce Latn
0.09
0.10
0.09
0.05
0.21
bmq Latn
0.10
0.07
0.05
0.05
0.05
cco Latn
0.10
0.06
0.05
0.05
0.05
bmr Latn
0.07
0.13
0.05
0.05
0.05
ccp Latn
0.11
0.19
0.09
0.06
0.09
bmu Latn
0.09
0.14
0.05
0.05
0.05
cdf Latn
0.09
0.12
0.05
0.05
0.09
bmv Latn
0.16
0.10
0.07
0.05
0.05
ceb Latn
0.11
0.12
0.28
0.28
0.37
bnj Latn
0.09
0.13
0.07
0.06
0.05
ceg Latn
0.15
0.15
0.04
0.05
0.08
bno Latn
0.10
0.18
0.18
0.11
0.33
cek Latn
0.09
0.10
0.05
0.05
0.06
bnp Latn
0.11
0.13
0.05
0.06
0.16
ces Latn
0.07
0.28
0.66
0.57
0.51
boa Latn
0.09
0.16
0.05
0.05
0.05
cfm Latn
0.14
0.15
0.05
0.05
0.25
boj Latn
0.13
0.10
0.05
0.05
0.07
cgc Latn
0.07
0.18
0.19
0.14
0.26
bom Latn
0.08
0.11
0.05
0.05
0.08
cha Latn
0.12
0.12
0.11
0.05
0.19
bon Latn
0.11
0.19
0.07
0.06
0.05
chd Latn
0.09
0.10
0.05
0.05
0.06
bov Latn
0.07
0.12
0.05
0.05
0.06
che Cyrl
0.07
0.10
0.07
0.05
0.08
box Latn
0.09
0.11
0.05
0.05
0.09
chf Latn
0.09
0.10
0.12
0.05
0.21
bpr Latn
0.13
0.13
0.09
0.05
0.09
chj Latn
0.10
0.06
0.05
0.05
0.05
bps Latn
0.16
0.11
0.08
0.05
0.08
chk Hani
0.07
0.13
0.07
0.05
0.08
bqc Latn
0.07
0.11
0.05
0.05
0.06
chq Latn
0.09
0.10
0.05
0.05
0.05
bqj Latn
0.17
0.12
0.09
0.05
0.07
chr Cher
0.07
0.05
0.09
0.05
0.05
bqp Latn
0.09
0.17
0.05
0.05
0.06
chu Cyrl
0.07
0.31
0.60
0.61
0.46
bre Latn
0.08
0.29
0.25
0.43
0.29
chv Cyrl
0.07
0.18
0.07
0.05
0.19
bru Latn
0.10
0.10
0.07
0.05
0.05
chz Latn
0.07
0.08
0.05
0.05
0.05
bsc Latn
0.15
0.08
0.09
0.05
0.05
cjo Latn
0.07
0.07
0.04
0.05
0.05
bsn Latn
0.16
0.07
0.04
0.05
0.07
cjp Latn
0.14
0.11
0.07
0.05
0.05
bss Latn
0.07
0.13
0.10
0.05
0.05
cjv Latn
0.06
0.08
0.07
0.05
0.05
btd Latn
0.09
0.30
0.21
0.17
0.28
ckb Latn
0.16
0.09
0.07
0.07
0.43
bth Latn
0.10
0.14
0.12
0.07
0.25
cko Latn
0.08
0.09
0.06
0.05
0.06
bto Latn
0.07
0.11
0.13
0.05
0.32
cle Latn
0.11
0.04
0.05
0.05
0.06
btt Latn
0.12
0.14
0.07
0.05
0.06
clu Latn
0.11
0.14
0.18
0.21
0.43
btx Latn
0.16
0.23
0.20
0.19
0.34
cly Latn
0.15
0.12
0.11
0.05
0.06
bud Latn
0.05
0.12
0.05
0.05
0.05
cme Latn
0.09
0.12
0.05
0.05
0.05
bug Latn
0.09
0.19
0.12
0.07
0.17
cmn Hani
0.07
0.40
0.59
0.62
0.65
buk Latn
0.07
0.11
0.05
0.05
0.08
cmo Latn
0.18
0.17
0.13
0.05
0.05
bul Cyrl
0.07
0.41
0.62
0.64
0.60
cmr Latn
0.11
0.13
0.05
0.05
0.06
bum Latn
0.09
0.16
0.06
0.05
0.17
cnh Latn
0.18
0.12
0.08
0.05
0.20
bus Latn
0.08
0.13
0.05
0.05
0.05
cni Latn
0.07
0.07
0.05
0.05
0.05
bvc Latn
0.14
0.21
0.06
0.05
0.08
cnk Latn
0.09
0.09
0.05
0.05
0.06
bvd Latn
0.19
0.11
0.06
0.05
0.08
cnl Latn
0.07
0.07
0.05
0.05
0.05
bvr Latn
0.12
0.07
0.09
0.05
0.05
cnt Latn
0.07
0.08
0.05
0.05
0.05
bvz Latn
0.13
0.10
0.08
0.05
0.05
cnw Latn
0.12
0.13
0.06
0.05
0.14
bwq Latn
0.15
0.09
0.06
0.05
0.11
coe Latn
0.07
0.08
0.05
0.05
0.06
bwu Latn
0.14
0.16
0.08
0.05
0.09
cof Latn
0.11
0.15
0.06
0.05
0.08
bxr Cyrl
0.07
0.09
0.25
0.27
0.31
cok Latn
0.13
0.08
0.05
0.05
0.07
byr Latn
0.07
0.08
0.05
0.05
0.06
con Latn
0.28
0.07
0.10
0.05
0.07
byx Latn
0.07
0.13
0.07
0.06
0.05
cop Copt
0.07
0.07
0.05
0.05
0.05
bzd Latn
0.07
0.10
0.05
0.05
0.04
cor Latn
0.09
0.12
0.09
0.05
0.11
bzh Latn
0.15
0.08
0.05
0.05
0.05
cot Latn
0.07
0.12
0.05
0.05
0.05
bzi Thai
0.07
0.07
0.07
0.05
0.05
cou Latn
0.10
0.14
0.06
0.05
0.05
Table C2 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
30
Article Title
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
cpa Latn
0.07
0.11
0.05
0.05
0.05
due Latn
0.10
0.12
0.16
0.05
0.20
cpb Latn
0.07
0.08
0.08
0.05
0.05
dug Latn
0.08
0.17
0.17
0.11
0.16
cpc Latn
0.09
0.12
0.06
0.05
0.05
duo Latn
0.14
0.08
0.16
0.06
0.31
cpu Latn
0.09
0.11
0.04
0.07
0.05
dur Latn
0.10
0.10
0.05
0.05
0.05
cpy Latn
0.07
0.08
0.05
0.05
0.05
dwr Latn
0.15
0.11
0.06
0.05
0.10
crh Cyrl
0.07
0.19
0.15
0.20
0.45
dww Latn
0.07
0.07
0.08
0.05
0.06
crj Latn
0.15
0.10
0.05
0.05
0.05
dyi Latn
0.16
0.13
0.07
0.05
0.06
crk Cans
0.07
0.05
0.05
0.05
0.05
dyo Latn
0.08
0.12
0.07
0.05
0.08
crl Cans
0.07
0.09
0.05
0.05
0.05
dyu Latn
0.07
0.09
0.05
0.05
0.17
crm Cans
0.07
0.05
0.05
0.05
0.06
dzo Tibt
0.07
0.04
0.05
0.08
0.09
crn Latn
0.10
0.09
0.05
0.05
0.06
ebk Latn
0.14
0.15
0.05
0.05
0.17
crq Latn
0.09
0.16
0.06
0.05
0.05
efi Latn
0.13
0.13
0.07
0.05
0.11
crs Latn
0.10
0.17
0.15
0.05
0.43
eka Latn
0.11
0.17
0.09
0.06
0.06
crt Latn
0.10
0.16
0.06
0.05
0.05
ell Grek
0.07
0.31
0.43
0.60
0.50
crx Latn
0.09
0.08
0.08
0.05
0.05
emi Latn
0.09
0.16
0.05
0.10
0.09
csk Latn
0.12
0.14
0.09
0.05
0.05
emp Latn
0.14
0.10
0.06
0.05
0.05
cso Latn
0.07
0.08
0.05
0.05
0.05
enb Latn
0.07
0.10
0.05
0.05
0.05
csy Latn
0.10
0.11
0.08
0.05
0.14
eng Latn
0.43
0.57
0.65
0.56
0.63
cta Latn
0.07
0.13
0.05
0.05
0.07
enl Latn
0.09
0.10
0.05
0.05
0.07
ctd Latn
0.11
0.14
0.07
0.05
0.22
enm Latn
0.33
0.46
0.55
0.45
0.55
ctp Latn
0.14
0.08
0.06
0.05
0.06
enq Latn
0.07
0.12
0.05
0.05
0.07
ctu Latn
0.10
0.09
0.11
0.06
0.27
epo Latn
0.15
0.25
0.57
0.61
0.48
cub Latn
0.11
0.08
0.05
0.05
0.05
eri Latn
0.13
0.13
0.07
0.06
0.06
cuc Latn
0.07
0.13
0.05
0.05
0.05
ese Latn
0.09
0.13
0.06
0.05
0.06
cui Latn
0.08
0.14
0.05
0.05
0.05
esi Latn
0.21
0.12
0.05
0.05
0.07
cuk Latn
0.16
0.11
0.13
0.05
0.07
esk Latn
0.07
0.11
0.05
0.05
0.05
cul Latn
0.09
0.12
0.07
0.05
0.05
ess Latn
0.14
0.13
0.06
0.05
0.05
cut Latn
0.11
0.10
0.05
0.05
0.07
est Latn
0.07
0.46
0.68
0.56
0.47
cux Latn
0.16
0.14
0.05
0.06
0.08
esu Latn
0.16
0.12
0.05
0.05
0.05
cwe Latn
0.11
0.19
0.13
0.11
0.22
etu Latn
0.13
0.11
0.05
0.05
0.05
cwt Latn
0.09
0.14
0.05
0.05
0.05
eus Latn
0.09
0.18
0.26
0.25
0.23
cya Latn
0.12
0.11
0.14
0.05
0.11
ewe Latn
0.11
0.11
0.05
0.05
0.07
cym Latn
0.08
0.23
0.44
0.53
0.49
ewo Latn
0.13
0.18
0.08
0.06
0.10
czt Latn
0.14
0.11
0.07
0.05
0.05
eza Latn
0.07
0.09
0.05
0.05
0.06
daa Latn
0.13
0.09
0.06
0.06
0.05
faa Latn
0.11
0.08
0.07
0.05
0.08
dad Latn
0.20
0.15
0.06
0.05
0.05
fai Latn
0.13
0.11
0.06
0.05
0.05
dah Latn
0.12
0.17
0.05
0.05
0.05
fal Latn
0.20
0.15
0.09
0.05
0.06
dan Latn
0.19
0.52
0.54
0.54
0.53
fao Latn
0.09
0.27
0.32
0.36
0.48
dbq Latn
0.13
0.07
0.06
0.05
0.05
far Latn
0.20
0.20
0.07
0.06
0.14
ddn Latn
0.10
0.05
0.10
0.05
0.05
fas Arab
0.07
0.46
0.67
0.66
0.67
ded Latn
0.07
0.09
0.06
0.05
0.06
ffm Latn
0.13
0.11
0.05
0.05
0.07
des Latn
0.07
0.10
0.05
0.05
0.05
fij Latn
0.05
0.12
0.08
0.05
0.12
deu Latn
0.15
0.38
0.52
0.52
0.46
fil Latn
0.13
0.29
0.47
0.55
0.55
dga Latn
0.10
0.13
0.05
0.05
0.05
fin Latn
0.13
0.45
0.58
0.57
0.47
dgc Latn
0.16
0.14
0.21
0.18
0.25
fon Latn
0.10
0.09
0.05
0.05
0.05
dgi Latn
0.12
0.07
0.05
0.05
0.06
for Latn
0.09
0.12
0.07
0.05
0.06
dgr Latn
0.10
0.11
0.05
0.05
0.05
fra Latn
0.13
0.54
0.65
0.65
0.54
dgz Latn
0.20
0.13
0.12
0.06
0.15
frd Latn
0.08
0.13
0.06
0.05
0.09
dhm Latn
0.17
0.17
0.10
0.05
0.10
fry Latn
0.21
0.38
0.30
0.37
0.42
did Latn
0.07
0.14
0.05
0.05
0.05
fub Latn
0.17
0.16
0.10
0.05
0.12
dig Latn
0.12
0.14
0.20
0.23
0.39
fue Latn
0.13
0.14
0.07
0.05
0.14
dik Latn
0.12
0.09
0.08
0.05
0.06
fuf Latn
0.10
0.10
0.09
0.05
0.13
dip Latn
0.15
0.15
0.05
0.05
0.06
fuh Latn
0.12
0.09
0.05
0.06
0.05
dis Latn
0.13
0.11
0.10
0.05
0.06
fuq Latn
0.11
0.11
0.10
0.05
0.10
dje Latn
0.12
0.09
0.08
0.05
0.07
fuv Latn
0.11
0.13
0.11
0.05
0.14
djk Latn
0.14
0.14
0.08
0.05
0.28
gaa Latn
0.12
0.13
0.05
0.05
0.05
djr Latn
0.07
0.12
0.05
0.05
0.05
gag Latn
0.07
0.13
0.33
0.38
0.40
dks Latn
0.14
0.12
0.05
0.05
0.05
gah Latn
0.07
0.15
0.05
0.05
0.05
dln Latn
0.12
0.12
0.05
0.05
0.29
gai Latn
0.07
0.09
0.05
0.05
0.05
dnj Latn
0.10
0.06
0.05
0.05
0.05
gam Latn
0.20
0.11
0.11
0.05
0.11
dnw Latn
0.18
0.12
0.07
0.05
0.06
gaw Latn
0.11
0.09
0.06
0.05
0.08
dob Latn
0.08
0.08
0.10
0.05
0.07
gbi Latn
0.10
0.11
0.06
0.05
0.08
dop Latn
0.12
0.07
0.05
0.05
0.05
gbo Latn
0.08
0.14
0.05
0.05
0.05
dos Latn
0.13
0.14
0.05
0.05
0.05
gbr Latn
0.17
0.08
0.10
0.05
0.09
dow Latn
0.06
0.07
0.05
0.05
0.05
gde Latn
0.10
0.05
0.06
0.05
0.05
dru Latn
0.07
0.14
0.09
0.05
0.09
gdg Latn
0.10
0.18
0.09
0.06
0.16
dsh Latn
0.12
0.10
0.07
0.05
0.06
gdn Latn
0.07
0.16
0.07
0.06
0.09
dtb Latn
0.11
0.13
0.06
0.05
0.08
gdr Latn
0.17
0.09
0.05
0.05
0.06
dtp Latn
0.12
0.12
0.05
0.05
0.24
geb Latn
0.07
0.08
0.05
0.05
0.05
dts Latn
0.09
0.09
0.05
0.05
0.06
gej Latn
0.09
0.10
0.05
0.05
0.08
Table C3 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
Article Title
31
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
gfk Latn
0.17
0.12
0.07
0.05
0.10
hlt Latn
0.09
0.09
0.05
0.05
0.06
ghe Deva
0.07
0.11
0.20
0.15
0.28
hmo Latn
0.09
0.14
0.09
0.05
0.07
ghs Latn
0.07
0.10
0.05
0.05
0.06
hmr Latn
0.21
0.06
0.07
0.05
0.20
gid Latn
0.10
0.05
0.05
0.05
0.08
hne Deva
0.07
0.27
0.29
0.39
0.60
gil Latn
0.07
0.08
0.04
0.05
0.23
hnj Latn
0.06
0.06
0.06
0.05
0.05
giz Latn
0.07
0.14
0.06
0.05
0.07
hnn Latn
0.11
0.17
0.17
0.12
0.31
gjn Latn
0.09
0.13
0.05
0.05
0.05
hns Latn
0.13
0.12
0.14
0.12
0.19
gkn Latn
0.09
0.16
0.05
0.05
0.14
hop Latn
0.19
0.17
0.05
0.05
0.11
gkp Latn
0.09
0.12
0.05
0.05
0.07
hot Latn
0.11
0.10
0.05
0.05
0.06
gla Latn
0.12
0.14
0.34
0.42
0.48
hra Latn
0.13
0.13
0.07
0.05
0.26
gle Latn
0.17
0.15
0.38
0.56
0.40
hrv Latn
0.09
0.35
0.64
0.66
0.63
glv Latn
0.11
0.10
0.09
0.05
0.11
hto Latn
0.07
0.06
0.05
0.06
0.05
gmv Latn
0.15
0.12
0.07
0.06
0.06
hub Latn
0.07
0.13
0.06
0.05
0.06
gna Latn
0.11
0.13
0.05
0.05
0.05
hui Latn
0.06
0.10
0.07
0.05
0.06
gnb Latn
0.13
0.11
0.06
0.05
0.20
hun Latn
0.08
0.38
0.70
0.66
0.52
gnd Latn
0.09
0.06
0.05
0.05
0.05
hus Latn
0.18
0.17
0.10
0.06
0.20
gng Latn
0.12
0.13
0.06
0.05
0.05
huu Latn
0.07
0.11
0.06
0.05
0.06
gnn Latn
0.07
0.10
0.05
0.05
0.08
huv Latn
0.07
0.13
0.06
0.05
0.11
gnw Latn
0.07
0.11
0.07
0.05
0.06
hvn Latn
0.14
0.17
0.09
0.05
0.11
gof Latn
0.15
0.09
0.06
0.05
0.09
hwc Latn
0.32
0.32
0.40
0.53
0.42
gog Latn
0.13
0.13
0.11
0.07
0.19
hye Armn
0.07
0.39
0.60
0.64
0.65
gom Latn
0.07
0.11
0.06
0.05
0.19
ian Latn
0.07
0.12
0.05
0.05
0.09
gor Latn
0.12
0.17
0.08
0.09
0.25
iba Latn
0.11
0.27
0.26
0.24
0.54
gqr Latn
0.19
0.08
0.05
0.05
0.05
ibo Latn
0.08
0.12
0.08
0.05
0.09
grt Beng
0.07
0.10
0.16
0.05
0.11
icr Latn
0.24
0.21
0.23
0.06
0.40
gso Latn
0.07
0.09
0.05
0.05
0.05
ifa Latn
0.10
0.15
0.06
0.05
0.32
gub Latn
0.13
0.11
0.08
0.05
0.05
ifb Latn
0.16
0.09
0.07
0.05
0.32
guc Latn
0.13
0.14
0.05
0.05
0.05
ife Latn
0.08
0.11
0.05
0.05
0.05
gud Latn
0.11
0.11
0.05
0.05
0.05
ifk Latn
0.14
0.14
0.07
0.05
0.21
gug Latn
0.12
0.17
0.09
0.05
0.10
ifu Latn
0.08
0.17
0.05
0.05
0.08
guh Latn
0.07
0.08
0.06
0.05
0.06
ify Latn
0.09
0.14
0.08
0.05
0.11
gui Latn
0.09
0.09
0.09
0.05
0.07
ign Latn
0.07
0.09
0.05
0.05
0.07
guj Gujr
0.07
0.34
0.56
0.70
0.69
ike Cans
0.07
0.05
0.05
0.05
0.08
guk Ethi
0.07
0.10
0.07
0.05
0.13
ikk Latn
0.07
0.11
0.11
0.05
0.05
gul Latn
0.32
0.26
0.26
0.24
0.49
ikw Latn
0.07
0.07
0.06
0.05
0.05
gum Latn
0.07
0.09
0.05
0.05
0.06
ilb Latn
0.09
0.12
0.14
0.09
0.16
gun Latn
0.12
0.11
0.11
0.05
0.06
ilo Latn
0.14
0.11
0.10
0.05
0.33
guo Latn
0.13
0.09
0.08
0.06
0.15
imo Latn
0.14
0.13
0.05
0.05
0.05
guq Latn
0.07
0.15
0.16
0.05
0.06
inb Latn
0.11
0.08
0.06
0.05
0.06
gur Latn
0.13
0.15
0.05
0.05
0.09
ind Latn
0.07
0.47
0.66
0.70
0.63
guu Latn
0.11
0.10
0.06
0.05
0.06
ino Latn
0.14
0.13
0.05
0.05
0.06
guw Latn
0.15
0.12
0.11
0.05
0.05
iou Latn
0.14
0.12
0.05
0.05
0.06
gux Latn
0.07
0.10
0.07
0.05
0.07
ipi Latn
0.07
0.14
0.04
0.05
0.05
guz Latn
0.07
0.15
0.08
0.05
0.06
iqw Latn
0.07
0.12
0.08
0.05
0.06
gvc Latn
0.14
0.08
0.05
0.05
0.06
iri Latn
0.12
0.14
0.05
0.05
0.05
gvf Latn
0.18
0.09
0.06
0.05
0.06
irk Latn
0.14
0.15
0.04
0.05
0.06
gvl Latn
0.11
0.14
0.04
0.05
0.07
iry Latn
0.08
0.14
0.11
0.16
0.20
gvn Latn
0.07
0.12
0.05
0.05
0.09
isd Latn
0.13
0.15
0.12
0.06
0.19
gwi Latn
0.19
0.11
0.05
0.05
0.05
isl Latn
0.07
0.33
0.57
0.59
0.47
gwr Latn
0.11
0.10
0.08
0.05
0.09
ita Latn
0.14
0.46
0.67
0.68
0.55
gya Latn
0.10
0.10
0.05
0.05
0.06
itv Latn
0.14
0.14
0.15
0.07
0.27
gym Latn
0.11
0.09
0.12
0.05
0.07
ium Latn
0.10
0.08
0.05
0.05
0.05
gyr Latn
0.08
0.10
0.07
0.05
0.05
ivb Latn
0.08
0.12
0.07
0.07
0.17
hae Latn
0.09
0.15
0.15
0.31
0.22
ivv Latn
0.11
0.13
0.07
0.05
0.19
hag Latn
0.10
0.13
0.06
0.05
0.06
iws Latn
0.10
0.09
0.05
0.05
0.05
hak Latn
0.13
0.08
0.07
0.05
0.05
ixl Latn
0.12
0.08
0.06
0.06
0.16
hat Latn
0.06
0.17
0.08
0.06
0.39
izr Latn
0.08
0.14
0.05
0.05
0.08
hau Latn
0.14
0.15
0.36
0.49
0.40
izz Latn
0.07
0.13
0.07
0.05
0.05
haw Latn
0.12
0.11
0.05
0.05
0.19
jaa Latn
0.10
0.12
0.06
0.05
0.08
hay Latn
0.09
0.14
0.06
0.05
0.15
jac Latn
0.13
0.07
0.06
0.05
0.09
hch Latn
0.08
0.13
0.06
0.05
0.08
jae Latn
0.07
0.07
0.05
0.05
0.05
heb Hebr
0.07
0.36
0.15
0.31
0.24
jam Latn
0.22
0.15
0.10
0.06
0.46
heg Latn
0.07
0.16
0.05
0.05
0.09
jav Latn
0.07
0.25
0.38
0.57
0.46
heh Latn
0.10
0.15
0.11
0.09
0.09
jbu Latn
0.12
0.12
0.08
0.05
0.08
hif Latn
0.09
0.12
0.16
0.35
0.43
jic Latn
0.13
0.24
0.07
0.05
0.12
hig Latn
0.15
0.07
0.09
0.05
0.05
jiv Latn
0.09
0.15
0.04
0.05
0.05
hil Latn
0.14
0.23
0.26
0.24
0.53
jmc Latn
0.15
0.10
0.05
0.06
0.09
hin Deva
0.07
0.40
0.56
0.62
0.61
jpn Jpan
0.07
0.37
0.62
0.56
0.50
hix Latn
0.07
0.08
0.06
0.05
0.05
jra Latn
0.09
0.12
0.06
0.05
0.06
hla Latn
0.14
0.15
0.06
0.05
0.07
jun Orya
0.07
0.05
0.11
0.06
0.12
Table C4 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
32
Article Title
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
jvn Latn
0.07
0.35
0.36
0.52
0.49
knf Latn
0.13
0.15
0.07
0.05
0.05
kaa Cyrl
0.07
0.17
0.14
0.16
0.52
kng Latn
0.07
0.14
0.08
0.05
0.15
kab Latn
0.11
0.14
0.07
0.06
0.13
knj Latn
0.07
0.09
0.05
0.05
0.18
kac Latn
0.13
0.10
0.05
0.05
0.05
knk Latn
0.06
0.11
0.05
0.05
0.08
kal Latn
0.09
0.11
0.05
0.05
0.13
kno Latn
0.10
0.10
0.05
0.05
0.07
kan Knda
0.07
0.34
0.56
0.64
0.61
knv Latn
0.18
0.12
0.05
0.05
0.08
kao Latn
0.09
0.09
0.05
0.05
0.06
kog Latn
0.11
0.12
0.06
0.05
0.05
kaq Latn
0.09
0.16
0.06
0.05
0.09
kor Hang
0.07
0.43
0.63
0.69
0.62
kat Geor
0.07
0.46
0.48
0.61
0.54
kpf Latn
0.07
0.10
0.05
0.05
0.05
kaz Cyrl
0.07
0.32
0.57
0.66
0.57
kpg Latn
0.22
0.15
0.05
0.05
0.15
kbc Latn
0.18
0.07
0.05
0.05
0.05
kpj Latn
0.07
0.10
0.04
0.05
0.07
kbh Latn
0.09
0.13
0.07
0.05
0.07
kpq Latn
0.15
0.14
0.04
0.05
0.06
kbm Latn
0.09
0.15
0.11
0.06
0.07
kpr Latn
0.13
0.10
0.10
0.05
0.08
kbo Latn
0.11
0.15
0.04
0.05
0.06
kpv Cyrl
0.07
0.09
0.09
0.05
0.11
kbp Latn
0.10
0.08
0.05
0.05
0.05
kpw Latn
0.14
0.10
0.05
0.05
0.05
kbq Latn
0.12
0.05
0.09
0.05
0.05
kpx Latn
0.07
0.13
0.09
0.05
0.05
kbr Latn
0.08
0.13
0.05
0.05
0.07
kpz Latn
0.09
0.12
0.05
0.05
0.09
kcg Latn
0.13
0.12
0.05
0.05
0.05
kqc Latn
0.08
0.09
0.11
0.05
0.08
kck Latn
0.08
0.13
0.09
0.05
0.18
kqe Latn
0.13
0.16
0.13
0.12
0.33
kdc Latn
0.13
0.14
0.20
0.19
0.21
kqo Latn
0.07
0.09
0.05
0.05
0.05
kde Latn
0.14
0.16
0.12
0.07
0.15
kqp Latn
0.14
0.14
0.05
0.05
0.06
kdi Latn
0.07
0.16
0.05
0.05
0.08
kqs Latn
0.10
0.13
0.05
0.05
0.06
kdj Latn
0.07
0.13
0.05
0.05
0.05
kqy Ethi
0.07
0.13
0.06
0.05
0.05
kdl Latn
0.07
0.11
0.07
0.05
0.09
krc Cyrl
0.07
0.17
0.17
0.16
0.48
kdp Latn
0.10
0.11
0.10
0.05
0.07
kri Latn
0.15
0.16
0.05
0.05
0.19
kek Latn
0.15
0.08
0.05
0.06
0.27
krj Latn
0.11
0.21
0.33
0.28
0.35
ken Latn
0.10
0.08
0.05
0.05
0.05
krl Latn
0.07
0.34
0.40
0.40
0.41
keo Latn
0.11
0.08
0.06
0.05
0.11
kru Deva
0.07
0.12
0.08
0.05
0.11
ker Latn
0.09
0.04
0.05
0.05
0.05
ksb Latn
0.12
0.16
0.12
0.12
0.21
kew Latn
0.13
0.14
0.05
0.05
0.06
ksc Latn
0.09
0.12
0.07
0.05
0.11
kez Latn
0.13
0.10
0.05
0.05
0.05
ksd Latn
0.15
0.14
0.06
0.05
0.12
kff Telu
0.07
0.14
0.24
0.20
0.20
ksf Latn
0.10
0.07
0.05
0.05
0.06
kgf Latn
0.08
0.10
0.05
0.05
0.05
ksr Latn
0.08
0.08
0.05
0.05
0.06
kgk Latn
0.07
0.10
0.06
0.05
0.05
kss Latn
0.12
0.10
0.05
0.05
0.05
kgp Latn
0.07
0.14
0.09
0.05
0.09
ksw Mymr
0.07
0.08
0.05
0.05
0.06
kgr Latn
0.14
0.20
0.06
0.05
0.13
ktb Ethi
0.07
0.05
0.07
0.05
0.10
kha Latn
0.12
0.07
0.07
0.05
0.06
ktj Latn
0.04
0.05
0.05
0.05
0.05
khk Latn
0.09
0.15
0.07
0.05
0.08
kto Latn
0.07
0.14
0.09
0.05
0.05
khm Khmr
0.07
0.05
0.55
0.62
0.55
ktu Latn
0.10
0.11
0.11
0.06
0.19
khq Latn
0.12
0.11
0.10
0.05
0.09
kua Latn
0.11
0.11
0.11
0.08
0.12
khs Latn
0.14
0.09
0.06
0.05
0.05
kub Latn
0.09
0.14
0.05
0.05
0.05
khy Latn
0.08
0.09
0.07
0.07
0.14
kud Latn
0.07
0.10
0.06
0.05
0.05
khz Latn
0.12
0.16
0.06
0.05
0.05
kue Latn
0.07
0.11
0.06
0.05
0.07
kia Latn
0.13
0.19
0.06
0.05
0.23
kuj Latn
0.12
0.12
0.05
0.05
0.05
kij Latn
0.07
0.14
0.07
0.05
0.06
kum Cyrl
0.07
0.16
0.13
0.24
0.45
kik Latn
0.14
0.15
0.05
0.05
0.05
kup Latn
0.18
0.15
0.08
0.05
0.07
kin Latn
0.14
0.13
0.14
0.06
0.23
kus Latn
0.12
0.09
0.10
0.05
0.05
kir Cyrl
0.07
0.20
0.65
0.65
0.61
kvg Latn
0.11
0.09
0.06
0.05
0.06
kix Latn
0.08
0.12
0.07
0.05
0.05
kvj Latn
0.17
0.13
0.06
0.05
0.05
kjb Latn
0.15
0.11
0.05
0.05
0.23
kvn Latn
0.12
0.09
0.08
0.05
0.06
kje Latn
0.09
0.18
0.06
0.05
0.06
kwd Latn
0.19
0.13
0.09
0.05
0.12
kjh Cyrl
0.07
0.18
0.11
0.17
0.36
kwf Latn
0.21
0.17
0.09
0.07
0.16
kjs Latn
0.13
0.10
0.07
0.05
0.05
kwi Latn
0.11
0.17
0.09
0.05
0.09
kki Latn
0.16
0.17
0.14
0.10
0.14
kwj Latn
0.10
0.12
0.06
0.05
0.05
kkj Latn
0.09
0.16
0.06
0.05
0.06
kxc Ethi
0.07
0.09
0.07
0.05
0.05
kle Deva
0.07
0.14
0.15
0.11
0.19
kxm Thai
0.07
0.08
0.14
0.06
0.08
kln Latn
0.10
0.10
0.05
0.05
0.12
kxw Latn
0.06
0.07
0.06
0.05
0.05
klv Latn
0.09
0.14
0.13
0.05
0.09
kyc Latn
0.07
0.11
0.06
0.05
0.06
kma Latn
0.12
0.08
0.05
0.05
0.05
kyf Latn
0.09
0.13
0.05
0.05
0.05
kmd Latn
0.10
0.11
0.06
0.05
0.09
kyg Latn
0.08
0.09
0.06
0.05
0.05
kmg Latn
0.08
0.08
0.05
0.05
0.05
kyq Latn
0.10
0.12
0.07
0.05
0.05
kmh Latn
0.07
0.10
0.05
0.05
0.05
kyu Mymr
0.07
0.09
0.05
0.05
0.05
kmk Latn
0.10
0.10
0.06
0.05
0.14
kyz Latn
0.17
0.10
0.05
0.05
0.05
kmm Latn
0.12
0.09
0.05
0.05
0.19
kze Latn
0.08
0.11
0.04
0.05
0.06
kmo Latn
0.10
0.09
0.05
0.06
0.06
kzf Latn
0.12
0.18
0.10
0.06
0.15
kmr Cyrl
0.07
0.09
0.07
0.05
0.24
lac Latn
0.16
0.05
0.06
0.05
0.11
kms Latn
0.13
0.08
0.04
0.05
0.07
lai Latn
0.16
0.13
0.07
0.08
0.19
kmu Latn
0.07
0.17
0.10
0.05
0.08
laj Latn
0.10
0.11
0.07
0.06
0.09
kmy Latn
0.12
0.08
0.05
0.05
0.05
lam Latn
0.09
0.14
0.07
0.07
0.16
kne Latn
0.15
0.13
0.12
0.04
0.09
lao Laoo
0.07
0.05
0.58
0.67
0.61
Table C5 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
Article Title
33
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lap Latn
0.14
0.15
0.06
0.05
0.08
mbb Latn
0.11
0.20
0.10
0.05
0.10
las Latn
0.09
0.09
0.05
0.05
0.05
mbc Latn
0.12
0.13
0.05
0.05
0.05
lat Latn
0.14
0.30
0.55
0.62
0.56
mbd Latn
0.13
0.12
0.11
0.05
0.10
lav Latn
0.08
0.34
0.62
0.55
0.52
mbf Latn
0.07
0.31
0.49
0.57
0.56
law Latn
0.09
0.09
0.06
0.05
0.09
mbh Latn
0.15
0.15
0.07
0.05
0.09
lbk Latn
0.12
0.10
0.09
0.05
0.14
mbi Latn
0.13
0.17
0.08
0.05
0.06
lcm Latn
0.16
0.20
0.05
0.06
0.15
mbj Latn
0.16
0.14
0.08
0.05
0.06
lcp Thai
0.07
0.08
0.06
0.05
0.05
mbl Latn
0.07
0.11
0.05
0.05
0.05
ldi Latn
0.14
0.12
0.07
0.05
0.19
mbs Latn
0.11
0.12
0.17
0.13
0.19
lee Latn
0.08
0.05
0.07
0.05
0.05
mbt Latn
0.14
0.12
0.07
0.05
0.09
lef Latn
0.05
0.13
0.06
0.05
0.05
mca Latn
0.16
0.10
0.05
0.05
0.06
leh Latn
0.09
0.14
0.08
0.07
0.15
mcb Latn
0.07
0.11
0.05
0.05
0.06
lem Latn
0.07
0.09
0.05
0.05
0.06
mcd Latn
0.05
0.09
0.05
0.05
0.06
leu Latn
0.12
0.14
0.05
0.05
0.07
mcf Latn
0.07
0.10
0.06
0.05
0.05
lew Latn
0.07
0.13
0.08
0.05
0.16
mck Latn
0.13
0.15
0.11
0.06
0.15
lex Latn
0.13
0.10
0.08
0.05
0.05
mcn Latn
0.09
0.10
0.07
0.06
0.10
lgg Latn
0.09
0.19
0.05
0.05
0.13
mco Latn
0.05
0.09
0.05
0.05
0.13
lgl Latn
0.20
0.14
0.06
0.06
0.12
mcp Latn
0.09
0.05
0.05
0.05
0.05
lgm Latn
0.12
0.11
0.06
0.06
0.09
mcq Latn
0.07
0.12
0.08
0.05
0.05
lhi Latn
0.09
0.12
0.05
0.05
0.10
mcu Latn
0.10
0.20
0.07
0.05
0.06
lhm Latn
0.12
0.08
0.05
0.05
0.05
mda Latn
0.06
0.07
0.05
0.05
0.05
lhu Latn
0.09
0.08
0.06
0.05
0.06
mdy Ethi
0.07
0.09
0.05
0.05
0.15
lia Latn
0.18
0.16
0.05
0.05
0.05
med Latn
0.07
0.09
0.06
0.05
0.07
lid Latn
0.16
0.09
0.08
0.05
0.06
mee Latn
0.11
0.12
0.05
0.05
0.06
lif Deva
0.07
0.07
0.10
0.05
0.13
mej Latn
0.07
0.11
0.09
0.05
0.08
lin Latn
0.12
0.10
0.08
0.04
0.13
mek Latn
0.08
0.10
0.08
0.05
0.14
lip Latn
0.08
0.12
0.06
0.05
0.07
men Latn
0.11
0.13
0.05
0.05
0.05
lis Lisu
0.07
0.08
0.05
0.05
0.06
meq Latn
0.10
0.07
0.07
0.05
0.05
lit Latn
0.07
0.29
0.56
0.60
0.54
met Latn
0.19
0.11
0.05
0.05
0.06
ljp Latn
0.07
0.29
0.33
0.30
0.39
meu Latn
0.10
0.14
0.10
0.05
0.08
llg Latn
0.07
0.09
0.13
0.05
0.07
mfe Latn
0.09
0.15
0.15
0.05
0.36
lln Latn
0.10
0.09
0.05
0.05
0.05
mfh Latn
0.07
0.07
0.06
0.05
0.07
lmk Latn
0.14
0.11
0.07
0.05
0.05
mfi Latn
0.15
0.07
0.06
0.05
0.06
lmp Latn
0.09
0.12
0.05
0.05
0.05
mfk Latn
0.09
0.16
0.05
0.05
0.05
lnd Latn
0.09
0.13
0.10
0.06
0.15
mfq Latn
0.08
0.05
0.05
0.05
0.06
lob Latn
0.07
0.10
0.05
0.05
0.04
mfy Latn
0.11
0.15
0.07
0.05
0.06
loe Latn
0.10
0.21
0.10
0.08
0.23
mfz Latn
0.13
0.09
0.05
0.05
0.05
log Latn
0.11
0.11
0.05
0.05
0.05
mgh Latn
0.13
0.10
0.04
0.05
0.08
lok Latn
0.13
0.12
0.05
0.05
0.05
mgo Latn
0.15
0.05
0.05
0.05
0.05
lol Latn
0.07
0.09
0.06
0.05
0.09
mgr Latn
0.17
0.13
0.10
0.07
0.21
lom Latn
0.11
0.07
0.05
0.05
0.05
mhi Latn
0.12
0.12
0.08
0.05
0.06
loq Latn
0.08
0.13
0.05
0.05
0.06
mhl Latn
0.10
0.10
0.05
0.05
0.05
loz Latn
0.18
0.14
0.06
0.05
0.29
mhr Cyrl
0.07
0.17
0.10
0.05
0.26
lsi Latn
0.13
0.08
0.05
0.05
0.05
mhx Latn
0.11
0.12
0.05
0.05
0.05
lsm Latn
0.11
0.16
0.08
0.07
0.08
mhy Latn
0.12
0.20
0.21
0.15
0.26
ltz Latn
0.15
0.34
0.22
0.20
0.41
mib Latn
0.09
0.13
0.07
0.06
0.13
luc Latn
0.07
0.09
0.11
0.05
0.05
mic Latn
0.10
0.13
0.08
0.05
0.06
lug Latn
0.07
0.13
0.08
0.05
0.22
mie Latn
0.08
0.17
0.06
0.05
0.12
luo Latn
0.12
0.12
0.05
0.05
0.15
mif Latn
0.09
0.09
0.07
0.05
0.07
lus Latn
0.17
0.14
0.10
0.05
0.09
mig Latn
0.13
0.19
0.05
0.05
0.07
lwo Latn
0.12
0.12
0.05
0.05
0.05
mih Latn
0.08
0.13
0.04
0.05
0.07
lww Latn
0.11
0.12
0.06
0.05
0.05
mil Latn
0.10
0.11
0.05
0.05
0.06
lzh Hani
0.07
0.24
0.54
0.50
0.59
mim Latn
0.11
0.15
0.05
0.05
0.06
maa Latn
0.13
0.14
0.05
0.05
0.05
min Latn
0.08
0.19
0.27
0.26
0.43
mad Latn
0.10
0.22
0.23
0.19
0.40
mio Latn
0.09
0.08
0.15
0.07
0.14
maf Latn
0.11
0.18
0.06
0.05
0.05
mip Latn
0.06
0.10
0.05
0.05
0.11
mag Deva
0.07
0.22
0.38
0.32
0.49
miq Latn
0.09
0.16
0.05
0.05
0.08
mah Latn
0.16
0.12
0.05
0.05
0.14
mir Latn
0.06
0.09
0.06
0.05
0.14
mai Deva
0.07
0.23
0.31
0.43
0.65
mit Latn
0.06
0.09
0.07
0.06
0.12
maj Latn
0.09
0.09
0.05
0.05
0.05
miy Latn
0.07
0.10
0.05
0.05
0.08
mak Latn
0.10
0.18
0.10
0.06
0.18
miz Latn
0.09
0.14
0.05
0.05
0.05
mal Mlym
0.07
0.12
0.07
0.05
0.06
mjc Latn
0.13
0.13
0.05
0.05
0.07
mam Latn
0.12
0.11
0.04
0.04
0.25
mjw Latn
0.08
0.09
0.08
0.05
0.05
maq Latn
0.12
0.15
0.05
0.06
0.05
mkd Cyrl
0.07
0.47
0.74
0.70
0.67
mar Deva
0.07
0.30
0.57
0.61
0.59
mkl Latn
0.11
0.05
0.06
0.05
0.05
mas Latn
0.07
0.17
0.09
0.06
0.04
mkn Latn
0.07
0.23
0.28
0.35
0.44
mau Latn
0.07
0.08
0.05
0.05
0.05
mks Latn
0.10
0.15
0.05
0.05
0.05
mav Latn
0.14
0.12
0.07
0.05
0.05
mlg Latn
0.12
0.08
0.37
0.45
0.46
maw Latn
0.18
0.11
0.05
0.05
0.05
mlh Latn
0.10
0.10
0.05
0.05
0.05
maz Latn
0.10
0.15
0.05
0.05
0.10
mlp Latn
0.07
0.20
0.06
0.05
0.08
Table C6 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
34
Article Title
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
mlt Latn
0.11
0.16
0.05
0.06
0.29
mzm Latn
0.09
0.09
0.05
0.05
0.05
mmn Latn
0.17
0.19
0.18
0.21
0.32
mzw Latn
0.05
0.09
0.05
0.05
0.06
mmo Latn
0.17
0.09
0.09
0.05
0.05
nab Latn
0.07
0.14
0.05
0.05
0.05
mmx Latn
0.14
0.11
0.05
0.05
0.06
naf Latn
0.07
0.15
0.05
0.05
0.06
mna Latn
0.11
0.08
0.05
0.05
0.05
nak Latn
0.11
0.12
0.04
0.05
0.08
mnb Latn
0.10
0.17
0.06
0.05
0.16
nan Latn
0.14
0.11
0.05
0.05
0.06
mnf Latn
0.11
0.13
0.05
0.05
0.06
naq Latn
0.09
0.10
0.05
0.05
0.07
mnh Latn
0.07
0.17
0.07
0.05
0.09
nas Latn
0.07
0.09
0.11
0.05
0.09
mnk Latn
0.09
0.17
0.05
0.05
0.07
nav Latn
0.19
0.09
0.05
0.05
0.05
mnx Latn
0.11
0.15
0.08
0.06
0.05
naw Latn
0.08
0.10
0.05
0.05
0.05
moa Latn
0.08
0.04
0.06
0.05
0.05
nbc Latn
0.09
0.12
0.06
0.05
0.07
moc Latn
0.08
0.13
0.06
0.05
0.05
nbe Latn
0.17
0.12
0.06
0.06
0.07
mog Latn
0.16
0.20
0.13
0.07
0.21
nbl Latn
0.09
0.13
0.15
0.21
0.29
mop Latn
0.20
0.10
0.07
0.06
0.27
nbu Latn
0.15
0.09
0.05
0.05
0.05
mor Latn
0.14
0.11
0.05
0.05
0.05
nca Latn
0.07
0.11
0.06
0.06
0.06
mos Latn
0.11
0.11
0.06
0.05
0.06
nch Latn
0.10
0.12
0.07
0.05
0.06
mox Latn
0.12
0.15
0.07
0.05
0.05
ncj Latn
0.14
0.10
0.05
0.05
0.07
mpg Latn
0.12
0.09
0.05
0.05
0.05
ncl Latn
0.10
0.09
0.06
0.09
0.13
mpm Latn
0.04
0.15
0.05
0.05
0.05
ncq Laoo
0.07
0.05
0.11
0.04
0.10
mps Latn
0.15
0.16
0.05
0.06
0.07
nct Latn
0.12
0.09
0.06
0.05
0.06
mpt Latn
0.13
0.11
0.07
0.05
0.07
ncu Latn
0.06
0.09
0.05
0.05
0.05
mpx Latn
0.09
0.10
0.07
0.05
0.05
ndc Latn
0.07
0.15
0.10
0.07
0.16
mqb Latn
0.11
0.09
0.04
0.05
0.05
nde Latn
0.09
0.13
0.15
0.21
0.29
mqj Latn
0.11
0.18
0.12
0.05
0.16
ndi Latn
0.11
0.10
0.06
0.05
0.05
mqy Latn
0.11
0.16
0.13
0.05
0.11
ndj Latn
0.13
0.11
0.06
0.05
0.12
mri Latn
0.16
0.09
0.09
0.05
0.19
ndo Latn
0.11
0.11
0.09
0.05
0.16
mrw Latn
0.09
0.19
0.10
0.14
0.31
ndp Latn
0.10
0.11
0.10
0.05
0.07
msa Latn
0.08
0.22
0.42
0.42
0.52
nds Latn
0.15
0.19
0.14
0.07
0.27
msb Latn
0.12
0.21
0.28
0.24
0.49
ndy Latn
0.07
0.14
0.07
0.06
0.14
mse Latn
0.12
0.09
0.08
0.05
0.05
ndz Latn
0.09
0.15
0.05
0.05
0.05
msk Latn
0.09
0.14
0.09
0.10
0.28
neb Latn
0.12
0.07
0.05
0.05
0.05
msm Latn
0.12
0.10
0.07
0.06
0.21
nep Deva
0.07
0.32
0.62
0.64
0.68
msy Latn
0.07
0.09
0.06
0.05
0.06
nfa Latn
0.07
0.09
0.06
0.05
0.05
mta Latn
0.12
0.10
0.05
0.05
0.05
nfr Latn
0.15
0.11
0.07
0.05
0.05
mtg Latn
0.11
0.09
0.05
0.05
0.05
ngc Latn
0.11
0.14
0.07
0.05
0.14
mti Latn
0.14
0.14
0.08
0.08
0.15
ngp Latn
0.13
0.17
0.16
0.12
0.19
mtj Latn
0.08
0.10
0.08
0.05
0.06
ngu Latn
0.06
0.09
0.05
0.06
0.15
mto Latn
0.11
0.14
0.05
0.05
0.05
nhd Latn
0.12
0.17
0.09
0.05
0.10
mtp Latn
0.11
0.12
0.05
0.05
0.05
nhe Latn
0.10
0.13
0.07
0.05
0.08
mua Latn
0.16
0.10
0.05
0.05
0.06
nhg Latn
0.10
0.12
0.05
0.05
0.14
mug Latn
0.13
0.11
0.05
0.06
0.07
nhi Latn
0.12
0.10
0.06
0.05
0.08
muh Latn
0.12
0.18
0.15
0.05
0.05
nho Latn
0.16
0.17
0.07
0.05
0.12
mup Deva
0.07
0.28
0.35
0.32
0.49
nhr Latn
0.17
0.14
0.05
0.05
0.07
mur Latn
0.14
0.12
0.05
0.05
0.08
nhu Latn
0.16
0.10
0.05
0.05
0.05
mux Latn
0.12
0.11
0.06
0.05
0.05
nhw Latn
0.08
0.14
0.07
0.05
0.06
muy Latn
0.11
0.07
0.05
0.05
0.05
nhx Latn
0.13
0.14
0.08
0.05
0.19
mva Latn
0.07
0.15
0.07
0.05
0.07
nhy Latn
0.14
0.16
0.05
0.06
0.15
mvn Latn
0.12
0.09
0.05
0.05
0.05
nii Latn
0.14
0.09
0.05
0.05
0.05
mvp Latn
0.11
0.12
0.15
0.05
0.22
nij Latn
0.09
0.23
0.18
0.16
0.23
mwm Latn
0.12
0.08
0.05
0.05
0.05
nim Latn
0.07
0.12
0.06
0.05
0.06
mwq Latn
0.10
0.10
0.06
0.05
0.05
nin Latn
0.07
0.13
0.08
0.05
0.07
mwv Latn
0.07
0.14
0.10
0.05
0.13
niq Latn
0.09
0.10
0.05
0.05
0.07
mww Latn
0.10
0.06
0.05
0.05
0.05
niy Latn
0.11
0.05
0.08
0.05
0.05
mxb Latn
0.09
0.14
0.05
0.05
0.06
njb Latn
0.17
0.13
0.05
0.05
0.05
mxp Latn
0.10
0.12
0.05
0.05
0.06
njm Latn
0.16
0.09
0.06
0.05
0.06
mxq Latn
0.09
0.06
0.05
0.05
0.10
njn Latn
0.09
0.12
0.05
0.05
0.05
mxt Latn
0.13
0.12
0.04
0.05
0.07
njo Latn
0.12
0.11
0.05
0.05
0.06
mxv Latn
0.10
0.16
0.05
0.05
0.16
njz Latn
0.08
0.13
0.05
0.05
0.05
mya Mymr
0.07
0.26
0.42
0.61
0.51
nkf Latn
0.13
0.16
0.06
0.05
0.06
myb Latn
0.07
0.13
0.07
0.05
0.09
nki Latn
0.10
0.13
0.05
0.05
0.26
myk Latn
0.07
0.12
0.05
0.05
0.07
nko Latn
0.10
0.10
0.05
0.05
0.05
myu Latn
0.07
0.12
0.09
0.05
0.06
nlc Latn
0.11
0.12
0.05
0.05
0.05
myv Cyrl
0.07
0.08
0.08
0.05
0.19
nld Latn
0.28
0.43
0.60
0.58
0.53
myw Latn
0.07
0.15
0.06
0.05
0.05
nlg Latn
0.20
0.21
0.07
0.09
0.21
myx Latn
0.10
0.12
0.04
0.05
0.10
nma Latn
0.07
0.12
0.08
0.05
0.05
myy Latn
0.07
0.08
0.09
0.05
0.06
nmf Latn
0.08
0.12
0.05
0.05
0.06
mza Latn
0.10
0.13
0.06
0.05
0.05
nmh Latn
0.09
0.10
0.05
0.06
0.06
mzh Latn
0.08
0.19
0.08
0.05
0.24
nmo Latn
0.10
0.10
0.06
0.05
0.06
mzk Latn
0.14
0.14
0.08
0.06
0.07
nmz Latn
0.15
0.12
0.08
0.05
0.10
mzl Latn
0.10
0.09
0.06
0.05
0.05
nnb Latn
0.10
0.14
0.07
0.05
0.10
Table C7 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
Article Title
35
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
nng Latn
0.07
0.09
0.07
0.05
0.06
oym Latn
0.07
0.12
0.05
0.05
0.05
nnh Latn
0.08
0.14
0.07
0.05
0.08
ozm Latn
0.13
0.06
0.06
0.05
0.05
nnl Latn
0.12
0.12
0.07
0.05
0.06
pab Latn
0.12
0.05
0.05
0.05
0.05
nno Latn
0.15
0.46
0.58
0.56
0.43
pad Latn
0.13
0.15
0.06
0.05
0.06
nnp Latn
0.07
0.08
0.07
0.05
0.05
pag Latn
0.14
0.14
0.20
0.17
0.33
nnq Latn
0.14
0.15
0.11
0.10
0.14
pah Latn
0.09
0.15
0.06
0.05
0.05
nnw Latn
0.07
0.05
0.05
0.05
0.05
pam Latn
0.13
0.18
0.11
0.11
0.38
noa Latn
0.07
0.08
0.05
0.06
0.05
pan Guru
0.07
0.31
0.58
0.67
0.69
nob Latn
0.16
0.38
0.59
0.60
0.56
pao Latn
0.10
0.13
0.07
0.05
0.08
nod Thai
0.07
0.09
0.47
0.50
0.50
pap Latn
0.15
0.31
0.30
0.23
0.52
nog Cyrl
0.07
0.16
0.18
0.38
0.41
pau Latn
0.16
0.18
0.06
0.05
0.21
nop Latn
0.09
0.15
0.05
0.05
0.05
pbb Latn
0.17
0.12
0.07
0.05
0.07
nor Latn
0.16
0.38
0.60
0.60
0.55
pbc Latn
0.17
0.12
0.05
0.05
0.05
not Latn
0.07
0.09
0.13
0.06
0.11
pbi Latn
0.13
0.06
0.05
0.05
0.07
nou Latn
0.16
0.11
0.11
0.06
0.13
pbl Latn
0.10
0.16
0.13
0.05
0.26
nph Latn
0.08
0.10
0.09
0.05
0.05
pck Latn
0.12
0.14
0.06
0.05
0.19
npi Deva
0.07
0.32
0.59
0.66
0.67
pcm Latn
0.19
0.18
0.30
0.29
0.45
npl Latn
0.10
0.09
0.05
0.07
0.18
pdc Latn
0.19
0.14
0.14
0.15
0.27
npo Latn
0.13
0.09
0.07
0.05
0.05
pdt Latn
0.17
0.18
0.17
0.12
0.34
npy Latn
0.09
0.13
0.11
0.05
0.07
pes Arab
0.07
0.42
0.66
0.66
0.63
nre Latn
0.10
0.15
0.07
0.05
0.07
pez Latn
0.08
0.23
0.09
0.05
0.10
nri Latn
0.11
0.12
0.09
0.05
0.09
pfe Latn
0.10
0.05
0.05
0.05
0.05
nsa Latn
0.07
0.12
0.09
0.05
0.06
pib Latn
0.07
0.11
0.04
0.05
0.06
nse Latn
0.12
0.17
0.13
0.07
0.23
pio Latn
0.07
0.09
0.06
0.05
0.12
nsm Latn
0.13
0.07
0.06
0.05
0.06
pir Latn
0.10
0.11
0.06
0.05
0.05
nsn Latn
0.15
0.09
0.06
0.07
0.12
pis Latn
0.21
0.11
0.12
0.06
0.20
nso Latn
0.11
0.13
0.12
0.05
0.27
pjt Latn
0.07
0.09
0.05
0.05
0.08
nst Latn
0.18
0.10
0.05
0.05
0.06
pkb Latn
0.11
0.15
0.12
0.07
0.28
nsu Latn
0.13
0.10
0.06
0.05
0.12
plg Latn
0.16
0.13
0.08
0.05
0.08
ntp Latn
0.07
0.10
0.05
0.05
0.04
pls Latn
0.07
0.19
0.07
0.14
0.27
ntr Latn
0.07
0.12
0.05
0.05
0.05
plt Latn
0.12
0.05
0.38
0.54
0.50
ntu Latn
0.07
0.08
0.06
0.05
0.05
plu Latn
0.13
0.08
0.05
0.05
0.05
nuj Latn
0.11
0.14
0.06
0.05
0.07
plw Latn
0.14
0.19
0.10
0.06
0.19
nus Latn
0.13
0.10
0.05
0.05
0.05
pma Latn
0.14
0.16
0.07
0.05
0.06
nuy Latn
0.23
0.10
0.05
0.05
0.05
pmf Latn
0.11
0.22
0.10
0.09
0.20
nvm Latn
0.07
0.11
0.05
0.05
0.05
pmx Latn
0.09
0.08
0.06
0.06
0.06
nwb Latn
0.14
0.06
0.05
0.05
0.05
pne Latn
0.08
0.23
0.09
0.05
0.11
nwi Latn
0.15
0.13
0.05
0.05
0.07
pny Latn
0.08
0.05
0.05
0.05
0.05
nwx Deva
0.07
0.16
0.18
0.14
0.29
poe Latn
0.13
0.13
0.05
0.05
0.06
nxd Latn
0.07
0.09
0.07
0.05
0.07
poh Latn
0.11
0.09
0.12
0.05
0.37
nya Latn
0.07
0.14
0.08
0.06
0.26
poi Latn
0.12
0.15
0.05
0.07
0.12
nyf Latn
0.15
0.19
0.21
0.17
0.25
pol Latn
0.09
0.48
0.60
0.65
0.61
nyn Latn
0.09
0.11
0.06
0.05
0.20
pon Latn
0.14
0.21
0.08
0.05
0.08
nyo Latn
0.07
0.16
0.05
0.05
0.15
por Latn
0.16
0.52
0.57
0.64
0.61
nyy Latn
0.11
0.16
0.08
0.05
0.09
pos Latn
0.12
0.17
0.06
0.06
0.27
nza Latn
0.07
0.10
0.05
0.05
0.05
poy Latn
0.14
0.18
0.08
0.05
0.07
nzi Latn
0.09
0.16
0.05
0.05
0.05
ppk Latn
0.15
0.15
0.06
0.04
0.16
nzm Latn
0.11
0.09
0.08
0.06
0.06
ppo Latn
0.10
0.18
0.05
0.05
0.05
obo Latn
0.15
0.12
0.05
0.05
0.07
pps Latn
0.10
0.11
0.06
0.05
0.08
ojb Cans
0.07
0.12
0.05
0.05
0.06
prf Latn
0.12
0.20
0.15
0.13
0.26
oji Latn
0.11
0.09
0.05
0.05
0.07
pri Latn
0.07
0.10
0.05
0.05
0.05
ojs Latn
0.07
0.08
0.05
0.05
0.06
prk Latn
0.09
0.13
0.06
0.05
0.10
oku Latn
0.12
0.11
0.05
0.05
0.05
prq Latn
0.07
0.08
0.05
0.05
0.05
okv Latn
0.13
0.22
0.14
0.08
0.13
prs Arab
0.07
0.43
0.66
0.64
0.64
old Latn
0.13
0.09
0.08
0.06
0.06
pse Latn
0.07
0.28
0.36
0.38
0.39
omb Latn
0.17
0.16
0.10
0.06
0.06
pss Latn
0.10
0.13
0.06
0.05
0.08
omw Latn
0.07
0.08
0.05
0.05
0.05
ptp Latn
0.10
0.11
0.05
0.05
0.05
ong Latn
0.07
0.17
0.07
0.05
0.06
ptu Latn
0.11
0.15
0.14
0.05
0.20
ons Latn
0.11
0.09
0.05
0.05
0.05
pua Latn
0.08
0.09
0.09
0.05
0.15
ood Latn
0.16
0.11
0.05
0.05
0.05
pui Latn
0.09
0.14
0.05
0.06
0.06
opm Latn
0.07
0.14
0.07
0.05
0.05
pwg Latn
0.18
0.14
0.06
0.08
0.12
ori Orya
0.07
0.04
0.58
0.75
0.65
pww Thai
0.07
0.08
0.10
0.05
0.05
ory Orya
0.07
0.04
0.56
0.75
0.64
pxm Latn
0.08
0.14
0.06
0.05
0.05
oss Cyrl
0.07
0.10
0.07
0.05
0.11
qub Latn
0.08
0.12
0.06
0.06
0.17
otd Latn
0.07
0.25
0.12
0.11
0.14
quc Latn
0.18
0.14
0.07
0.05
0.37
ote Latn
0.08
0.07
0.05
0.05
0.06
quf Latn
0.07
0.10
0.05
0.05
0.06
otm Latn
0.10
0.08
0.05
0.05
0.05
qug Latn
0.07
0.11
0.09
0.05
0.12
otn Latn
0.09
0.11
0.05
0.05
0.05
quh Latn
0.07
0.12
0.07
0.05
0.30
otq Latn
0.14
0.08
0.06
0.05
0.06
qul Latn
0.07
0.14
0.06
0.07
0.32
ots Latn
0.11
0.10
0.05
0.05
0.10
qup Latn
0.07
0.13
0.05
0.05
0.13
Table C8 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
36
Article Title
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
quw Latn
0.07
0.10
0.07
0.05
0.18
shp Latn
0.07
0.12
0.06
0.05
0.05
quy Latn
0.07
0.11
0.07
0.06
0.27
shu Latn
0.09
0.20
0.16
0.11
0.19
quz Latn
0.07
0.10
0.07
0.05
0.24
sig Latn
0.13
0.08
0.05
0.05
0.05
qva Latn
0.07
0.10
0.07
0.05
0.18
sil Latn
0.14
0.07
0.05
0.05
0.05
qvc Latn
0.09
0.11
0.06
0.05
0.05
sim Latn
0.08
0.10
0.06
0.05
0.07
qve Latn
0.09
0.13
0.06
0.05
0.33
sin Sinh
0.07
0.16
0.51
0.67
0.57
qvh Latn
0.12
0.12
0.05
0.07
0.24
sja Latn
0.10
0.10
0.05
0.05
0.05
qvi Latn
0.06
0.12
0.06
0.05
0.10
sld Latn
0.14
0.10
0.05
0.05
0.05
qvm Latn
0.07
0.13
0.06
0.05
0.19
slk Latn
0.09
0.48
0.69
0.64
0.56
qvn Latn
0.07
0.10
0.05
0.06
0.14
sll Latn
0.07
0.11
0.07
0.05
0.08
qvo Latn
0.10
0.11
0.06
0.05
0.08
slv Latn
0.17
0.50
0.63
0.60
0.60
qvs Latn
0.09
0.10
0.05
0.05
0.18
sme Latn
0.15
0.17
0.09
0.05
0.14
qvw Latn
0.09
0.10
0.05
0.05
0.13
smk Latn
0.10
0.10
0.08
0.06
0.27
qvz Latn
0.09
0.10
0.06
0.05
0.13
sml Latn
0.13
0.12
0.17
0.10
0.23
qwh Latn
0.06
0.14
0.09
0.05
0.22
smo Latn
0.10
0.07
0.08
0.05
0.29
qxh Latn
0.07
0.11
0.04
0.05
0.15
smt Latn
0.11
0.15
0.05
0.05
0.21
qxl Latn
0.07
0.11
0.07
0.05
0.08
sna Latn
0.07
0.11
0.11
0.08
0.18
qxn Latn
0.07
0.15
0.07
0.05
0.23
snc Latn
0.15
0.12
0.05
0.05
0.06
qxo Latn
0.09
0.11
0.05
0.06
0.23
snd Arab
0.07
0.19
0.61
0.67
0.61
qxr Latn
0.07
0.13
0.10
0.05
0.14
snf Latn
0.14
0.11
0.06
0.05
0.06
rad Latn
0.09
0.09
0.06
0.05
0.06
snn Latn
0.14
0.17
0.09
0.05
0.05
rai Latn
0.16
0.18
0.05
0.07
0.12
snp Latn
0.12
0.11
0.06
0.05
0.09
rap Latn
0.13
0.13
0.06
0.05
0.21
snw Latn
0.09
0.11
0.05
0.05
0.05
rar Latn
0.10
0.07
0.06
0.05
0.22
sny Latn
0.07
0.13
0.06
0.05
0.08
rav Deva
0.07
0.09
0.17
0.05
0.07
som Latn
0.08
0.09
0.31
0.39
0.43
raw Latn
0.12
0.14
0.05
0.05
0.06
sop Latn
0.15
0.14
0.07
0.05
0.20
rej Latn
0.12
0.25
0.20
0.18
0.31
soq Latn
0.19
0.17
0.05
0.07
0.08
rel Latn
0.15
0.12
0.08
0.05
0.06
sot Latn
0.13
0.10
0.09
0.05
0.18
rgu Latn
0.07
0.07
0.04
0.04
0.15
soy Latn
0.16
0.07
0.05
0.05
0.05
ria Latn
0.08
0.10
0.06
0.05
0.06
spa Latn
0.11
0.49
0.64
0.69
0.58
rim Latn
0.13
0.16
0.05
0.06
0.07
spl Latn
0.07
0.12
0.05
0.05
0.05
rjs Deva
0.07
0.13
0.26
0.22
0.28
spp Latn
0.10
0.08
0.06
0.05
0.09
rkb Latn
0.12
0.07
0.05
0.05
0.08
sps Latn
0.14
0.17
0.05
0.05
0.05
rmc Latn
0.12
0.17
0.17
0.09
0.18
spy Latn
0.07
0.09
0.05
0.05
0.07
rmo Latn
0.17
0.16
0.08
0.06
0.11
sqi Latn
0.10
0.33
0.68
0.66
0.65
rmy Latn
0.12
0.23
0.10
0.06
0.22
sri Latn
0.07
0.13
0.04
0.05
0.06
rnl Latn
0.11
0.14
0.05
0.05
0.09
srm Latn
0.12
0.09
0.06
0.05
0.21
ron Latn
0.11
0.50
0.62
0.65
0.53
srn Latn
0.07
0.15
0.07
0.05
0.42
roo Latn
0.07
0.10
0.05
0.05
0.05
srp Latn
0.09
0.47
0.59
0.59
0.63
rop Latn
0.20
0.20
0.06
0.05
0.20
srq Latn
0.16
0.07
0.11
0.07
0.10
row Latn
0.07
0.08
0.06
0.05
0.08
ssd Latn
0.12
0.17
0.05
0.05
0.05
rro Latn
0.08
0.11
0.07
0.05
0.05
ssg Latn
0.13
0.06
0.11
0.06
0.06
rub Latn
0.13
0.13
0.08
0.05
0.08
ssw Latn
0.07
0.11
0.09
0.12
0.24
ruf Latn
0.14
0.20
0.10
0.09
0.11
ssx Latn
0.11
0.13
0.07
0.05
0.06
rug Latn
0.10
0.13
0.06
0.05
0.06
stn Latn
0.19
0.16
0.11
0.05
0.15
run Latn
0.16
0.15
0.09
0.06
0.27
stp Latn
0.09
0.04
0.05
0.05
0.05
rus Cyrl
0.07
0.50
0.55
0.67
0.64
sua Latn
0.18
0.13
0.05
0.05
0.05
rwo Latn
0.07
0.10
0.07
0.06
0.05
suc Latn
0.13
0.11
0.06
0.05
0.08
sab Latn
0.07
0.10
0.08
0.05
0.06
sue Latn
0.13
0.14
0.08
0.05
0.06
sag Latn
0.11
0.19
0.10
0.06
0.20
suk Latn
0.16
0.13
0.07
0.07
0.09
sah Cyrl
0.07
0.12
0.08
0.05
0.30
sun Latn
0.09
0.33
0.45
0.50
0.45
saj Latn
0.05
0.10
0.05
0.05
0.08
sur Latn
0.15
0.11
0.06
0.05
0.10
san Taml
0.07
0.05
0.07
0.05
0.05
sus Latn
0.12
0.15
0.04
0.05
0.05
sas Latn
0.11
0.22
0.28
0.24
0.30
suz Deva
0.07
0.10
0.11
0.06
0.27
sat Latn
0.12
0.08
0.06
0.05
0.06
swe Latn
0.13
0.48
0.73
0.60
0.59
sba Latn
0.12
0.11
0.06
0.05
0.11
swg Latn
0.21
0.27
0.25
0.34
0.35
sbd Latn
0.12
0.09
0.06
0.06
0.05
swh Latn
0.12
0.31
0.50
0.57
0.54
sbl Latn
0.12
0.08
0.18
0.12
0.21
swk Latn
0.11
0.13
0.04
0.06
0.19
sck Deva
0.07
0.17
0.28
0.44
0.47
swp Latn
0.08
0.10
0.08
0.06
0.06
sda Latn
0.11
0.16
0.09
0.05
0.13
sxb Latn
0.10
0.13
0.08
0.05
0.14
sdq Latn
0.06
0.15
0.12
0.10
0.16
sxn Latn
0.07
0.09
0.05
0.05
0.18
seh Latn
0.13
0.11
0.07
0.06
0.23
syb Latn
0.13
0.09
0.10
0.05
0.11
ses Latn
0.14
0.09
0.07
0.05
0.07
syc Syrc
0.07
0.05
0.05
0.08
0.10
sey Latn
0.06
0.10
0.05
0.05
0.05
syl Latn
0.07
0.06
0.05
0.05
0.05
sgb Latn
0.14
0.22
0.17
0.10
0.31
szb Latn
0.07
0.21
0.04
0.05
0.06
sgw Ethi
0.07
0.09
0.10
0.13
0.24
tab Cyrl
0.07
0.11
0.12
0.05
0.10
sgz Latn
0.07
0.13
0.06
0.05
0.07
tac Latn
0.12
0.20
0.05
0.05
0.07
shi Latn
0.13
0.07
0.05
0.05
0.07
taj Deva
0.07
0.13
0.14
0.09
0.20
shk Latn
0.11
0.07
0.06
0.05
0.07
tam Taml
0.07
0.35
0.53
0.56
0.60
shn Mymr
0.07
0.05
0.06
0.05
0.05
tap Latn
0.14
0.18
0.10
0.08
0.20
Table C9 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
Article Title
37
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
taq Latn
0.10
0.11
0.07
0.05
0.06
tro Latn
0.15
0.12
0.07
0.05
0.07
tar Latn
0.10
0.10
0.05
0.05
0.05
trp Latn
0.10
0.08
0.06
0.05
0.05
tat Cyrl
0.07
0.31
0.12
0.15
0.45
trq Latn
0.05
0.12
0.05
0.05
0.07
tav Latn
0.13
0.11
0.05
0.05
0.09
trs Latn
0.06
0.10
0.07
0.05
0.10
taw Latn
0.14
0.09
0.07
0.05
0.07
tsg Latn
0.11
0.17
0.15
0.11
0.27
tbc Latn
0.09
0.12
0.05
0.05
0.06
tsn Latn
0.12
0.12
0.09
0.05
0.23
tbg Latn
0.07
0.14
0.08
0.05
0.06
tsw Latn
0.07
0.12
0.07
0.05
0.08
tbk Latn
0.07
0.17
0.11
0.11
0.27
tsz Latn
0.08
0.10
0.08
0.05
0.14
tbl Latn
0.12
0.12
0.12
0.05
0.06
ttc Latn
0.14
0.20
0.10
0.05
0.09
tbo Latn
0.12
0.13
0.10
0.05
0.05
tte Latn
0.07
0.07
0.08
0.05
0.05
tbw Latn
0.11
0.15
0.08
0.06
0.25
ttq Latn
0.09
0.09
0.07
0.06
0.10
tby Latn
0.14
0.12
0.06
0.05
0.12
ttr Cyrl
0.07
0.31
0.18
0.13
0.42
tbz Latn
0.07
0.09
0.05
0.05
0.05
tuc Latn
0.18
0.10
0.05
0.05
0.05
tca Latn
0.07
0.07
0.05
0.05
0.07
tue Latn
0.07
0.10
0.04
0.05
0.05
tcc Latn
0.09
0.10
0.05
0.05
0.05
tuf Latn
0.11
0.13
0.10
0.05
0.06
tcs Latn
0.21
0.19
0.11
0.06
0.21
tui Latn
0.17
0.14
0.08
0.05
0.07
tcz Latn
0.12
0.11
0.09
0.05
0.05
tuk Latn
0.11
0.11
0.22
0.22
0.44
tdt Latn
0.15
0.15
0.09
0.05
0.36
tul Latn
0.12
0.18
0.05
0.05
0.05
ted Latn
0.10
0.09
0.05
0.05
0.05
tum Latn
0.13
0.22
0.10
0.07
0.21
tee Latn
0.06
0.07
0.06
0.05
0.14
tuo Latn
0.12
0.09
0.04
0.05
0.08
tel Telu
0.07
0.30
0.60
0.67
0.67
tur Latn
0.11
0.29
0.68
0.68
0.63
tem Latn
0.12
0.05
0.06
0.05
0.05
tvk Latn
0.11
0.19
0.08
0.05
0.10
teo Latn
0.09
0.12
0.05
0.07
0.08
twb Latn
0.10
0.12
0.05
0.05
0.06
ter Latn
0.12
0.13
0.06
0.05
0.06
twi Latn
0.10
0.15
0.05
0.05
0.13
tet Latn
0.07
0.11
0.05
0.05
0.13
twu Latn
0.12
0.15
0.16
0.05
0.07
tfr Latn
0.12
0.14
0.08
0.05
0.05
txq Latn
0.07
0.15
0.09
0.05
0.06
tgk Cyrl
0.07
0.19
0.05
0.04
0.31
txu Latn
0.13
0.17
0.07
0.05
0.05
tgl Latn
0.13
0.29
0.47
0.55
0.55
tyv Cyrl
0.07
0.12
0.19
0.18
0.44
tgo Latn
0.09
0.14
0.05
0.05
0.05
tzh Latn
0.08
0.10
0.09
0.05
0.22
tgp Latn
0.15
0.21
0.08
0.09
0.09
tzj Latn
0.13
0.15
0.09
0.06
0.21
tha Thai
0.07
0.08
0.56
0.60
0.56
tzo Latn
0.08
0.11
0.07
0.05
0.30
thk Latn
0.16
0.10
0.04
0.05
0.05
ubr Latn
0.15
0.13
0.06
0.05
0.10
thl Deva
0.07
0.24
0.34
0.44
0.45
ubu Latn
0.13
0.07
0.07
0.05
0.06
tif Latn
0.07
0.10
0.05
0.05
0.08
udm Cyrl
0.07
0.10
0.07
0.05
0.20
tih Latn
0.09
0.11
0.09
0.05
0.26
udu Latn
0.19
0.11
0.05
0.05
0.08
tik Latn
0.09
0.07
0.05
0.05
0.05
uig Cyrl
0.07
0.20
0.13
0.14
0.44
tim Latn
0.07
0.11
0.06
0.05
0.06
ukr Cyrl
0.07
0.40
0.64
0.67
0.57
tir Ethi
0.07
0.06
0.27
0.22
0.38
upv Latn
0.10
0.12
0.06
0.05
0.05
tiy Latn
0.15
0.17
0.08
0.06
0.08
ura Latn
0.07
0.08
0.05
0.05
0.05
tke Latn
0.13
0.14
0.06
0.05
0.09
urb Latn
0.14
0.11
0.12
0.05
0.05
tku Latn
0.10
0.09
0.06
0.05
0.15
urd Arab
0.07
0.37
0.49
0.67
0.56
tlb Latn
0.09
0.13
0.07
0.05
0.09
urk Thai
0.07
0.09
0.07
0.05
0.05
tlf Latn
0.07
0.07
0.09
0.05
0.08
urt Latn
0.06
0.13
0.08
0.05
0.06
tlh Latn
0.22
0.29
0.24
0.13
0.29
ury Latn
0.14
0.10
0.05
0.05
0.06
tlj Latn
0.19
0.14
0.11
0.05
0.12
usa Latn
0.07
0.10
0.06
0.05
0.05
tmc Latn
0.10
0.12
0.05
0.05
0.08
usp Latn
0.18
0.11
0.07
0.05
0.24
tmd Latn
0.07
0.08
0.05
0.05
0.05
uth Latn
0.07
0.10
0.09
0.05
0.07
tna Latn
0.11
0.12
0.13
0.05
0.07
uvh Latn
0.07
0.09
0.07
0.05
0.05
tnk Latn
0.11
0.11
0.05
0.05
0.04
uvl Latn
0.09
0.16
0.06
0.05
0.09
tnn Latn
0.13
0.10
0.07
0.05
0.07
uzb Latn
0.09
0.14
0.54
0.59
0.58
tnp Latn
0.12
0.07
0.05
0.07
0.06
uzn Cyrl
0.07
0.14
0.07
0.10
0.47
tnr Latn
0.13
0.07
0.05
0.05
0.06
vag Latn
0.10
0.11
0.05
0.05
0.06
tob Latn
0.07
0.12
0.04
0.05
0.09
vap Latn
0.19
0.12
0.06
0.05
0.17
toc Latn
0.06
0.09
0.05
0.05
0.05
var Latn
0.10
0.13
0.07
0.05
0.06
toh Latn
0.11
0.12
0.06
0.06
0.22
ven Latn
0.11
0.12
0.06
0.05
0.11
toi Latn
0.07
0.13
0.08
0.06
0.24
vid Latn
0.11
0.14
0.11
0.09
0.09
toj Latn
0.12
0.06
0.07
0.05
0.29
vie Latn
0.09
0.38
0.54
0.63
0.53
ton Latn
0.09
0.08
0.05
0.05
0.26
viv Latn
0.07
0.11
0.06
0.05
0.05
too Latn
0.10
0.11
0.06
0.05
0.11
vmy Latn
0.13
0.10
0.05
0.05
0.10
top Latn
0.08
0.13
0.05
0.05
0.17
vun Latn
0.13
0.10
0.06
0.05
0.05
tos Latn
0.06
0.07
0.05
0.05
0.07
vut Latn
0.08
0.05
0.05
0.05
0.05
tpi Latn
0.17
0.17
0.09
0.06
0.31
waj Latn
0.10
0.08
0.06
0.05
0.06
tpm Latn
0.14
0.12
0.06
0.05
0.06
wal Latn
0.15
0.10
0.06
0.06
0.13
tpp Latn
0.13
0.15
0.06
0.05
0.10
wap Latn
0.11
0.11
0.06
0.05
0.06
tpt Latn
0.14
0.07
0.09
0.05
0.15
war Latn
0.11
0.16
0.15
0.14
0.37
tpz Latn
0.12
0.11
0.06
0.05
0.06
way Latn
0.10
0.12
0.07
0.05
0.05
tqb Latn
0.07
0.11
0.08
0.05
0.05
wba Latn
0.09
0.10
0.08
0.06
0.11
tqo Latn
0.12
0.08
0.06
0.05
0.05
wbm Latn
0.09
0.13
0.06
0.05
0.09
trc Latn
0.05
0.14
0.05
0.05
0.07
wbp Latn
0.07
0.07
0.06
0.05
0.05
trn Latn
0.12
0.15
0.06
0.06
0.05
wca Latn
0.07
0.14
0.05
0.05
0.08
Table C10 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
Springer Nature 2021 LATEX template
38
Article Title
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
lan script
BOW
mBert
XLM-R-B
XLM-R-L
Glot500-m
wer Latn
0.09
0.15
0.05
0.05
0.05
zac Latn
0.12
0.20
0.09
0.09
0.18
whk Latn
0.11
0.17
0.07
0.05
0.11
zad Latn
0.15
0.10
0.04
0.05
0.05
wim Latn
0.07
0.08
0.06
0.05
0.08
zae Latn
0.14
0.13
0.10
0.05
0.06
wiu Latn
0.12
0.13
0.05
0.06
0.05
zai Latn
0.08
0.21
0.13
0.09
0.25
wmw Latn
0.14
0.16
0.23
0.31
0.41
zam Latn
0.09
0.16
0.07
0.05
0.13
wnc Latn
0.07
0.12
0.07
0.06
0.05
zao Latn
0.14
0.09
0.06
0.05
0.06
wnu Latn
0.11
0.13
0.05
0.05
0.05
zar Latn
0.11
0.17
0.06
0.05
0.08
wob Latn
0.11
0.06
0.05
0.05
0.05
zas Latn
0.07
0.16
0.07
0.06
0.13
wol Latn
0.16
0.12
0.07
0.05
0.07
zat Latn
0.13
0.11
0.11
0.06
0.13
wos Latn
0.16
0.10
0.08
0.05
0.06
zav Latn
0.07
0.06
0.05
0.05
0.06
wrs Latn
0.15
0.10
0.06
0.05
0.05
zaw Latn
0.07
0.06
0.06
0.05
0.07
wsg Telu
0.07
0.09
0.13
0.08
0.07
zca Latn
0.21
0.14
0.18
0.06
0.21
wsk Latn
0.12
0.15
0.08
0.05
0.10
zho Hani
0.07
0.39
0.63
0.63
0.59
wuv Latn
0.18
0.09
0.09
0.05
0.06
zia Latn
0.14
0.11
0.06
0.05
0.06
wwa Latn
0.16
0.08
0.05
0.06
0.05
ziw Latn
0.13
0.17
0.14
0.11
0.23
xal Cyrl
0.07
0.12
0.08
0.05
0.14
zlm Latn
0.07
0.47
0.68
0.71
0.62
xav Latn
0.11
0.13
0.08
0.05
0.10
zoc Latn
0.11
0.08
0.06
0.05
0.11
xbr Latn
0.09
0.09
0.08
0.05
0.07
zom Latn
0.10
0.16
0.13
0.05
0.27
xed Latn
0.11
0.10
0.06
0.05
0.07
zos Latn
0.15
0.16
0.05
0.06
0.14
xho Latn
0.09
0.14
0.21
0.30
0.34
zpc Latn
0.13
0.12
0.11
0.05
0.12
xla Latn
0.13
0.08
0.08
0.05
0.05
zpi Latn
0.13
0.16
0.09
0.05
0.08
xmm Latn
0.14
0.30
0.42
0.40
0.40
zpl Latn
0.07
0.13
0.13
0.06
0.17
xnn Latn
0.07
0.11
0.10
0.08
0.19
zpm Latn
0.17
0.14
0.05
0.06
0.08
xog Latn
0.07
0.16
0.06
0.06
0.22
zpo Latn
0.10
0.15
0.13
0.06
0.10
xon Latn
0.06
0.17
0.05
0.05
0.05
zpq Latn
0.07
0.10
0.06
0.05
0.09
xpe Latn
0.08
0.11
0.05
0.05
0.06
zpt Latn
0.11
0.11
0.10
0.05
0.16
xrb Latn
0.11
0.11
0.05
0.05
0.05
zpu Latn
0.14
0.08
0.05
0.05
0.06
xsb Latn
0.11
0.14
0.11
0.08
0.23
zpv Latn
0.10
0.08
0.05
0.05
0.05
xsi Latn
0.09
0.13
0.05
0.05
0.05
zpz Latn
0.05
0.07
0.08
0.05
0.05
xsm Latn
0.19
0.08
0.05
0.05
0.05
zsm Latn
0.07
0.53
0.71
0.63
0.58
xsr Deva
0.07
0.09
0.05
0.05
0.06
zsr Latn
0.09
0.12
0.07
0.05
0.09
xsu Latn
0.13
0.15
0.05
0.05
0.08
ztq Latn
0.10
0.13
0.10
0.08
0.19
xtd Latn
0.14
0.16
0.05
0.05
0.07
zty Latn
0.11
0.06
0.09
0.05
0.12
xtm Latn
0.07
0.15
0.06
0.06
0.08
zul Latn
0.07
0.11
0.23
0.33
0.37
xtn Latn
0.09
0.16
0.07
0.06
0.13
zyb Latn
0.15
0.10
0.06
0.05
0.05
xuo Latn
0.10
0.08
0.05
0.05
0.05
zyp Latn
0.10
0.15
0.05
0.05
0.06
yaa Latn
0.07
0.11
0.06
0.05
0.06
yad Latn
0.11
0.09
0.05
0.05
0.05
yal Latn
0.15
0.13
0.06
0.05
0.07
yam Latn
0.13
0.05
0.05
0.05
0.05
yan Latn
0.10
0.13
0.05
0.05
0.05
yao Latn
0.13
0.13
0.06
0.05
0.15
yap Latn
0.13
0.14
0.07
0.05
0.22
yaq Latn
0.16
0.16
0.07
0.05
0.06
yas Latn
0.13
0.10
0.05
0.05
0.05
yat Latn
0.11
0.05
0.05
0.05
0.06
yaz Latn
0.07
0.12
0.08
0.05
0.05
ybb Latn
0.07
0.09
0.05
0.05
0.05
yby Latn
0.07
0.08
0.07
0.07
0.05
ycn Latn
0.10
0.09
0.05
0.05
0.05
yim Latn
0.13
0.12
0.09
0.05
0.06
yka Latn
0.09
0.14
0.10
0.07
0.26
yle Latn
0.07
0.13
0.05
0.05
0.05
yli Latn
0.11
0.17
0.09
0.05
0.10
yml Latn
0.08
0.08
0.05
0.05
0.06
yom Latn
0.09
0.16
0.06
0.05
0.21
yon Latn
0.12
0.11
0.11
0.05
0.09
yor Latn
0.11
0.14
0.10
0.05
0.10
yrb Latn
0.19
0.10
0.11
0.05
0.06
yre Latn
0.08
0.11
0.05
0.05
0.05
yss Latn
0.10
0.12
0.08
0.05
0.08
yua Latn
0.16
0.16
0.11
0.05
0.13
yue Hani
0.07
0.40
0.60
0.60
0.56
yuj Latn
0.14
0.08
0.09
0.06
0.07
yut Latn
0.11
0.14
0.05
0.05
0.05
yuw Latn
0.10
0.12
0.09
0.05
0.05
yuz Latn
0.07
0.12
0.10
0.05
0.10
yva Latn
0.13
0.15
0.06
0.05
0.06
zaa Latn
0.10
0.20
0.20
0.07
0.29
zab Latn
0.07
0.08
0.13
0.07
0.16
Table C11 zero-shot score of BOW, mBERT, XLM-R-B, XLM-R-L, and Glot500-m.
