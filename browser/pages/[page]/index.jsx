import PageLayout from '../../layouts/page'
import { useRouter } from 'next/router'

export default function index() {
    return (
        <PageLayout>
            <div>
                {useRouter().query.page}
            </div>
        </PageLayout>
    )
}

