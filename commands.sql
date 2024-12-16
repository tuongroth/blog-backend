-- Create the blogs table with the specified columns
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,        -- Unique, incrementing id
    author VARCHAR(255),          -- Author name (string)
    url VARCHAR(255) NOT NULL,    -- URL (string, cannot be empty)
    title VARCHAR(255) NOT NULL,  -- Title of the blog (string, cannot be empty)
    likes INT DEFAULT 0           -- Likes (integer, default value is 0)
);

-- Insert at least two blog entries into the table
INSERT INTO blogs (author, url, title, likes)
VALUES 
    ('John Doe', 'https://example.com/first-blog', 'My First Blog', 5),
    ('Jane Smith', 'https://example.com/second-blog', 'Learning SQL', 12);

-- Query the table to verify the data has been inserted
SELECT * FROM blogs;
