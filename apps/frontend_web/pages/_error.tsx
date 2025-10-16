import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode: number
  hasGetInitialProps: boolean
}

function CustomError({ statusCode }: ErrorProps) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
    </div>
  )
}

CustomError.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default CustomError