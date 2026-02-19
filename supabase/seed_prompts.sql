-- Memory Bank: Curated Daily Prompts (Nexa Lite)
-- 100 thoughtful questions across 10 categories and 3 depths

-- ============================================================
-- CHILDHOOD
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What is the earliest memory you can recall?', 'childhood', 'light'),
('What was your favourite toy as a child?', 'childhood', 'light'),
('What games did you play most as a child?', 'childhood', 'light'),
('Describe the house or flat where you grew up.', 'childhood', 'medium'),
('What was your favourite meal that someone made for you as a child?', 'childhood', 'medium'),
('Who was your best friend growing up, and what did you do together?', 'childhood', 'medium'),
('What is a childhood fear you eventually overcame?', 'childhood', 'deep'),
('What is something you wish you could tell your younger self?', 'childhood', 'deep'),
('Describe a moment from childhood that shaped who you are today.', 'childhood', 'deep'),
('What smell or sound instantly takes you back to your childhood?', 'childhood', 'medium');

-- ============================================================
-- FAMILY
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What is a favourite family tradition you remember?', 'family', 'light'),
('Describe a typical Sunday in your family when you were growing up.', 'family', 'light'),
('What is the funniest thing a family member has ever said?', 'family', 'light'),
('How did your parents or guardians meet?', 'family', 'medium'),
('What values did your family teach you that you still hold today?', 'family', 'medium'),
('Describe a family holiday that stands out in your memory.', 'family', 'medium'),
('What is something you learnt about a family member that surprised you?', 'family', 'deep'),
('How has your relationship with your parents changed over the years?', 'family', 'deep'),
('What family story gets told at every gathering?', 'family', 'light'),
('What is the most important lesson your family taught you?', 'family', 'deep');

-- ============================================================
-- MILESTONES
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What was your first day at school like?', 'milestones', 'light'),
('Describe the moment you got your first job.', 'milestones', 'light'),
('What was the happiest day of your life so far?', 'milestones', 'medium'),
('What achievement are you most proud of?', 'milestones', 'medium'),
('Describe a turning point that changed the direction of your life.', 'milestones', 'deep'),
('What was the most difficult decision you ever had to make?', 'milestones', 'deep'),
('What is a goal you set and achieved that once felt impossible?', 'milestones', 'medium'),
('Describe the moment you felt you had truly "grown up."', 'milestones', 'deep'),
('What was your wedding day like, or a celebration that meant the world to you?', 'milestones', 'medium'),
('What is a moment you wish you could relive?', 'milestones', 'deep');

-- ============================================================
-- REFLECTIONS
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What made you smile today?', 'reflections', 'light'),
('What is something small that brings you joy every day?', 'reflections', 'light'),
('What are you looking forward to this week?', 'reflections', 'light'),
('If you could have dinner with anyone, living or dead, who would it be?', 'reflections', 'medium'),
('What advice would you give to someone half your age?', 'reflections', 'medium'),
('What do you think is your greatest strength?', 'reflections', 'medium'),
('If you could change one thing about the world, what would it be?', 'reflections', 'deep'),
('What does happiness mean to you, and has that changed over time?', 'reflections', 'deep'),
('What is the kindest thing anyone has ever done for you?', 'reflections', 'medium'),
('What legacy do you hope to leave behind?', 'reflections', 'deep');

-- ============================================================
-- GRATITUDE
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What are three things you are grateful for today?', 'gratitude', 'light'),
('Who is someone you are thankful to have in your life?', 'gratitude', 'light'),
('What is a simple pleasure you never take for granted?', 'gratitude', 'light'),
('What experience taught you to appreciate what you have?', 'gratitude', 'medium'),
('Who believed in you when you did not believe in yourself?', 'gratitude', 'deep'),
('What is a challenge you are now grateful for having faced?', 'gratitude', 'deep'),
('What is the best gift you have ever received, and why?', 'gratitude', 'medium'),
('What place makes you feel most at peace?', 'gratitude', 'medium'),
('What is something about your daily life that past you would be amazed by?', 'gratitude', 'medium'),
('Write a thank-you letter to someone who changed your life.', 'gratitude', 'deep');

-- ============================================================
-- RELATIONSHIPS
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('How did you meet your closest friend?', 'relationships', 'light'),
('What quality do you most value in a friend?', 'relationships', 'light'),
('Describe a time someone showed you unexpected kindness.', 'relationships', 'medium'),
('What is the best piece of advice you have ever received?', 'relationships', 'medium'),
('How do you show the people you love that you care?', 'relationships', 'medium'),
('What is a friendship you lost that you still think about?', 'relationships', 'deep'),
('Who has had the biggest influence on your life, and how?', 'relationships', 'deep'),
('What have you learnt about love over the years?', 'relationships', 'deep'),
('Describe a moment of forgiveness that was important to you.', 'relationships', 'deep'),
('What do you wish you had said to someone but never did?', 'relationships', 'deep');

-- ============================================================
-- CAREER
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What did you want to be when you grew up?', 'career', 'light'),
('What was your very first job, and what did you learn from it?', 'career', 'light'),
('What skill are you most proud of developing?', 'career', 'medium'),
('Describe a mentor who made a difference in your career.', 'career', 'medium'),
('What is the biggest risk you took in your working life?', 'career', 'deep'),
('If you could start your career over, would you change anything?', 'career', 'deep'),
('What project or accomplishment at work are you most proud of?', 'career', 'medium'),
('What did you learn from your biggest professional setback?', 'career', 'deep'),
('How has your idea of "success" changed over time?', 'career', 'deep'),
('What advice would you give someone just starting in your field?', 'career', 'medium');

-- ============================================================
-- TRAVEL
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What is the best holiday you have ever had?', 'travel', 'light'),
('What is your favourite place you have ever visited?', 'travel', 'light'),
('Describe a meal you had while travelling that you still think about.', 'travel', 'light'),
('What is the most beautiful thing you have seen while travelling?', 'travel', 'medium'),
('Describe a travel experience that changed your perspective.', 'travel', 'deep'),
('Where in the world would you most like to visit, and why?', 'travel', 'medium'),
('What is the most unexpected thing that happened to you on a trip?', 'travel', 'medium'),
('Describe a journey (not just a destination) that was memorable.', 'travel', 'deep'),
('What did you learn about yourself through travelling?', 'travel', 'deep'),
('What place felt like a second home the moment you arrived?', 'travel', 'medium');

-- ============================================================
-- TRADITIONS
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What is your favourite holiday tradition?', 'traditions', 'light'),
('What food is always at your family celebrations?', 'traditions', 'light'),
('Describe how your family celebrates birthdays.', 'traditions', 'light'),
('What tradition have you started that you hope will continue?', 'traditions', 'medium'),
('What cultural or family tradition means the most to you?', 'traditions', 'medium'),
('What tradition from your childhood do you still practise today?', 'traditions', 'medium'),
('Is there a tradition you wish your family had kept?', 'traditions', 'deep'),
('What would you want future generations to know about how your family celebrated?', 'traditions', 'deep'),
('Describe a recipe that has been passed down in your family.', 'traditions', 'medium'),
('What song, poem, or saying is part of your family culture?', 'traditions', 'deep');

-- ============================================================
-- LESSONS
-- ============================================================
insert into public.daily_prompts (question_text, category, depth) values
('What is the most important thing life has taught you?', 'lessons', 'medium'),
('What is a mistake you made that taught you something valuable?', 'lessons', 'medium'),
('What book, film, or song changed how you see the world?', 'lessons', 'light'),
('What is something you believe now that you did not believe 10 years ago?', 'lessons', 'deep'),
('What is a hard truth you have had to accept?', 'lessons', 'deep'),
('Who taught you the most about resilience?', 'lessons', 'medium'),
('What is a fear you faced, and what did you learn from it?', 'lessons', 'deep'),
('What would you tell the next generation about living a good life?', 'lessons', 'deep'),
('What is something you had to unlearn?', 'lessons', 'deep'),
('What life lesson do you wish you had learnt sooner?', 'lessons', 'medium');
