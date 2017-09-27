export default function (component) {
    return () => import(`@/${component}.vue`)
}