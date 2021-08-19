const prodToken = '{{ token }}';

const devToken = '{{ token }}';

const token = process.env.NODE_ENV === 'dev' ? devToken : prodToken;

module.exports = { token };
